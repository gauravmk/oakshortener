const client = require("redis").createClient(process.env.REDISCLOUD_URL || "redis://");
const validator = require("validator");

function getRedisKey(k) {
  return `oakshortener:${k}`;
}

function setShortlink(key, value) {
  return new Promise(resolve => {
    if (!key || !value) {
      throw Error("Must provide both key and value");
    }
    if (!validator.isURL(value, { require_protocol: true })) {
      throw Error("Value must be a valid URL with the protocol (http/https)");
    }
    client.set(getRedisKey(key), value, resolve);
  });
}

function getShortlink(key) {
  return new Promise(resolve => {
    if (!key) {
      throw Error("Must provide key");
    }
    client.get(getRedisKey(key), (err, val) => {
      resolve(val);
    });
  });
}

module.exports = {
  client,
  getShortlink,
  setShortlink
};
