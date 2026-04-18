const redis = require("../config/redis");

const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttl = 60) => {
  await redis.setex(key, ttl, JSON.stringify(value));
};

const deleteCachePattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
};

module.exports = { getCache, setCache, deleteCachePattern };