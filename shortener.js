var redis = require("redis"),
    client = redis.createClient(process.env.REDISCLOUD_URL || 'redis://');
const validator = require('validator')

function getRedisKey(k) {
  return `oakshortener:${k}`
}

function setShortlink(key, value) {
  return new Promise(resolve => {
    if (!key || !value) {
      throw Error('Must provide both key and value')
    }
    if (!validator.isURL(value)) {
      throw Error('Value must be a URL')
    }
    client.set(getRedisKey(key), value, resolve)
  });
};

function getShortlink(key) {
  return new Promise(resolve => {
    client.get(getRedisKey(key), (err, val) => {
      resolve(val)
    });
  });
}

module.exports = {
  getShortlink,
  setShortlink,
}
