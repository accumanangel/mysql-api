// Load environment variables from a .env file
require("dotenv").config();

// Import the mysql2 module, using the promise-based interface
const mysql = require("mysql2/promise");

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
  // Database host address (usually 'localhost' or an IP address)
  host: process.env.DB_HOST,

  // Database user
  user: process.env.DB_USER,

  // Password for the database user
  password: process.env.DB_PASSWORD,

  // Name of the database to connect to
  database: process.env.DB_NAME,

  // Allow multiple connections to wait for availability
  waitForConnections: true,

  // Maximum number of connections in the pool
  connectionLimit: 10,

  // Number of requests that can be queued if no connection is available (0 means unlimited)
  queueLimit: 0,
});

// Export the connection pool for use in other modules
module.exports = pool;
