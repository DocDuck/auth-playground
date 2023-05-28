import dotenv  from "dotenv"
import express from 'express';
// import redis from 'redis';
import pg from 'pg';
dotenv.config()

const { Pool } = pg;

const app = express();

// Redis client setup
// const redisClient = redis.createClient({
//   host: 'redis', // Name of the Redis service defined in the Docker Compose file
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redisClient.on('error', (err) => {
//   console.error('Error connecting to Redis:', err);
// });

// PostgreSQL connection pool setup
const pool = new Pool({
  user: 'postgres', // PostgreSQL username defined in the Docker Compose file
  password: 'postgres', // PostgreSQL password defined in the Docker Compose file
  host: 'postgres', // Name of the PostgreSQL service defined in the Docker Compose file
  database: 'postgres', // PostgreSQL database name defined in the Docker Compose file
  port: 5432, // PostgreSQL default port
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error connecting to PostgreSQL:', err);
});

// Sample API endpoint
app.get('/', (req, res) => {
  // Perform Redis and PostgreSQL operations here
  // redisClient.set('key', 'value', (redisErr) => {
  //   if (redisErr) {
  //     console.error('Error setting key in Redis:', redisErr);
  //   }


  // });
  pool.query('SELECT NOW()', (pgErr, pgRes) => {
    if (pgErr) {
      console.error('Error executing PostgreSQL query:', pgErr);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const currentTime = pgRes.rows[0].now;
      res.json({ redisValue: 'value', currentTime });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});