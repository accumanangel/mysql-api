// Load environment variables from .env file
require("dotenv").config();
var cors = require("cors");

// Import necessary modules using CommonJS
const express = require("express");
const bodyParser = require("body-parser");

//cors

// Import routes and middleware
const authRouter = require("./routes/auth.js");
const todoRouter = require("./routes/todos.js");
const errorHandler = require("./middleware/errorHandler/errorHandler.js");

// Get the PORT from environment variables or use 5000 as a default
const PORT = process.env.PORT || 5000;

// Create an instance of Express
const app = express();
app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(bodyParser.json());

// Route to check if the app is running
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "App is running",
  });
});

// Mount the todoRouter at the /api endpoint
app.use("/api", todoRouter);

// Mount the authRouter at the /api/auth endpoint
app.use("/api/auth", authRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Use the custom error handler middleware
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
