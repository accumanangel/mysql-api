// db.js

import mysql from "mysql2/promise"; // Use promise-based connections
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Add password if needed
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue
});

// Export the connection pool
export default pool;
