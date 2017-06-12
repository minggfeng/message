const db = require('../');

const Message = db.Model.extend({
  tableName: 'messages',
  orgs: function() {
    return this.belongsTo('Org');
  },
  profiles: function() {
    return this.belongsTo('Profile');
  }
});

module.exports = db.model('Message', Message);
