import dotenv  from "dotenv"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import redis from 'redis';
import pg from 'pg';
dotenv.config()

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const { Pool } = pg;

const app = express();

// Redis client setup
const redisClient = redis.createClient({
  host: 'redis', // Name of the Redis service defined in the Docker Compose file
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

// PostgreSQL connection pool setup
const pool = new Pool({
  host: DB_HOST, // Name of the PostgreSQL service defined in the Docker Compose file
  port: DB_PORT, // PostgreSQL default port
  database: DB_NAME, // PostgreSQL database name defined in the Docker Compose file
  user: DB_USER, // PostgreSQL username defined in the Docker Compose file
  password: DB_PASSWORD, // PostgreSQL password defined in the Docker Compose file
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
app.get('/download', (req, res) => {
  res.download('/test.pdf', '/test2.pdf');
});


const run = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {

  }
};

run();