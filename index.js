const express = require('express');
const redis = require('redis');

const app = express();
const redisClient = redis.createClient();

function cacheMiddleware(req, res, next) {
  const { key } = req.params;

  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Error retrieving data from cache:', err);
      return next();
    }

    if (data !== null) {
      console.log('Data found in cache!');
      res.json(JSON.parse(data));
    } else {
      console.log('Data not found in cache!');
      next();
    }
  });
}

app.get('/api/data/:key', cacheMiddleware, (req, res) => {
  const { key } = req.params;

  // Dummy data retrieval or computation
  setTimeout(() => {
    const data = { key, value: Math.random() };

    redisClient.setex(key, 3600, JSON.stringify(data));

    console.log('Data retrieved and stored in cache!');
    res.json(data);
  }, 2000); // Simulating a delay of 2 seconds
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
