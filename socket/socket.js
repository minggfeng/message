const server = require('../server/index.js');
const io = require('socket.io')(server);
const models = require('../db/models');
const redis = require('../redis/utils.js');

const fetchNsps = () => {
  return models.Org.fetchAll({ columns: ['id'] })
  .then(orgs => orgs.serialize().map(org => org.id) || [])
  .catch(err => [])
}

var nsps;
fetchNsps()
.then(results => {
  nsps = results;
  let createNsp = (orgId) => {

    let nsp = io.of(`/${orgId}`);
    let messages = [];
    let members = [];
    let memberKey = orgId + 0.1;
    let messageKey = orgId + 0.2;
    let allSockets = {};

    nsp.on('connection', socket => {

      if (redis.exists(memberKey)) {
        redis.get(memberKey, (data) => {
          if (data) {
            members = JSON.parse(data);
          }
        })
      } else {
        redis.set(memberKey);
      }

      if (redis.exists(messageKey)) {
        redis.get(messageKey, (data) => {
          if (data) {
            messages = JSON.parse(data);
          }
        })
      } else {
        redis.set(messageKey);
      }

      socket.on('join', userId => {
        if (userId && members.indexOf(userId) === - 1) {
          members.push(userId);
          allSockets[userId] = socket;
          redis.set(memberKey, members, (err, reply) => {
            if (reply) { 
              console.log('added member', reply)
            } else {
              console.log('error', err)
            }
          }) 
        }

        if (!messages.length) {
          models.Message
          .where({ organization_id: orgId })
          .query((qb) => {
            qb.orderBy('created_at')
          })
          .fetchAll({ withRelated: 'profiles' })
          .then(res => {
            messages = res.serialize().slice(Math.max(res.length - 10, 1))
          })
          .catch(err => {
            console.log('Error fetching messages from DB');
          })
        }
        nsp.emit('init', {members: members, messages: messages });
      });

      socket.on('message', message => {
        let created_at = new Date().toISOString();
        models.Profile.where({ id: message.user }).fetch({ columns: ['display'] })
        .then(res => {
          message.profiles = {};
          message.profiles.display = res.get('display');
          message.created_at = created_at;
          if (messages.length >= 50) {
            messages.shift();
          }
          messages.push(message);
          nsp.emit('message', messages);
          redis.set(messageKey, messages, (err, reply) => {
            if (reply) {
              console.log('added message', reply)
            } else {
              console.log('error adding message', err);
            }
          });
        })
        .catch(err => {
          console.log('error updating message')
        })
        
        models.Message.forge({ 
          profile_id: message.user,
          organization_id: message.orgId,
          text: message.text,
          created_at: created_at
        }).save()
        .then(message => {
          console.log('Successful insert of message');
        })
        .catch(err => console.log('Error inserting message'));
      });

      socket.on('leave', userId => {
        let index = members.indexOf(userId);
        members.splice(index, 1);
        redis.set(memberKey, members, (err, reply) => {
          if (reply) {
            console.log('user left');
          } else {
            console.log('error on user leaving');
          }
        })
        nsp.emit('leave', members);
      });

      socket.on('disconnect',() => {
        let userId;
        for (key in allSockets) {
          if (allSockets[key] === socket) {
            userId = key;
          }
        }
        let index = members.indexOf(userId);
        members.splice(index, 1);
        redis.set(memberKey, members, (err, reply) => {
          if (reply) {
            console.log('socket disconnected');
          } else {
            console.log('error on socket disconnect');
          }
        })
        nsp.emit('leave', members);
      })
    })
  }

  nsps.forEach(orgId => createNsp(orgId));

})