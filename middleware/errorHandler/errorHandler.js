// errorHandler.js

// Custom error-handling middleware
const errorHandler = (err, req, res, next) => {
  // Set the status code, defaulting to 500 if not provided
  const statusCode = err.status || 500;

  // Log the error message (you can customize this as needed)
  console.error(err.message);

  // Send a JSON response with the error message
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};

module.exports = errorHandler;
