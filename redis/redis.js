const redis = require('redis');
const port = 6200;
const redisClient = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient(port);

redisClient.on('connect', () => {
  console.log('redis connected');
})

module.exports = redisClient;