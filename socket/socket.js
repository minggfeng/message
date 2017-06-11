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
      // redis.delete(memberKey)
      console.log(`connected nsp${orgId}`, members, messages);

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
        nsp.emit('init', {members: members, messages: messages })
      });

      socket.on('message', message => {
        messages.push(message);
        redis.set(messageKey, messages, (err, reply) => {
          if (reply) {
            console.log('added message', reply)
          } else {
            console.log('error adding message', err);
          }
        })
        nsp.emit('message', messages);
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


      // socket.on('message', message => {
      //   messages.push(message);
      //   redis.addMessage(messageKey, JSON.stringify(messages), (err, reply) => {
      //     if (reply) {
      //       console.log('updated message')
      //     }
      //   });
      //   console.log('message',messages)
      //   nsp.emit('message', messages);

      //   // models.Message.forge({ 
      //   //   profile_id: message.user,
      //   //   organization_id: message.orgId,
      //   //   text: message.text,
      //   //   created_at: new Date().toISOString()
      //   // }).save()
      //   // .then(message => {
      //   //   console.log('Successful insert of message');
      //   // })
      //   // .catch(err => console.log('Error inserting message'));
      // });
    })
  }

  nsps.forEach(orgId => createNsp(orgId));

})