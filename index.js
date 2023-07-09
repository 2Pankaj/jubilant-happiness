const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully!');
  }
});
module.exports = { pool };


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
