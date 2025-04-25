const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'webcourse.cs.nuim.ie',
  user: process.env.DB_USER || 'u240157',
  password: process.env.DB_PASSWORD || 'Huavai9ea9iech6e',
  database: process.env.DB_NAME || 'cs230_u240157',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = pool;