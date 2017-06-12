const db = require('../');

const Profile = db.Model.extend({
  tableName: 'profiles',
  profiles: function() {
    return this.hasMany('Message');
  }
});

module.exports = db.model('Profile', Profile);