const db = require('../');

const Org = db.Model.extend({
  tableName: 'organizations',
  messages: function() {
    return this.hasMany('Message');
  }
});

module.exports = db.model('Org', Org);
