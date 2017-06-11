const redisClient = require('./redis.js');

module.exports.exists = key => {
  return redisClient.exists(key, (err, result) => {
    if (result === 1) {
      return true;
    } else {
      return false;
    }
  })
}

module.exports.set = (key, data) => {
  if (!data) {
    data = [];
  }
  return redisClient.set(key, JSON.stringify(data));
}

module.exports.delete = key => {
  return redisClient.del(key, (err, reply) => {
    if (reply) {
      console.log(`Deleted ${key}`); 
    } else {
      console.log(`Error deleting ${key}`);
    }
  })
}

module.exports.get = (orgId, cb) => {
  return redisClient.get(orgId, (err, reply) => {
    if (reply) {
      return cb(reply);
    } else {
      return cb(err);
    }
  })
}

