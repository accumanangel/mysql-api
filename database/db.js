// Load environment variables from a .env file
require("dotenv").config();

// Import the mysql2 module, using the promise-based interface
const mysql = require("mysql2/promise");

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
  // Database host address (usually 'localhost' or an IP address)
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the connection pool for use in other modules
module.exports = pool;
