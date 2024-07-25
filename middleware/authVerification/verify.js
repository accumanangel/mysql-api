// Load environment variables from .env file
require("dotenv").config();

// Import the jsonwebtoken module
const jsonwebtoken = require("jsonwebtoken");

// Authentication middleware to verify JWT tokens
const authCheck = async (req, res, next) => {
  // Retrieve the token from the request header
  let token = req.header("auth-token");

  // If no token is provided, return a 400 status with an error message
  if (!token) {
    return res.status(400).json({
      error: {
        message: "Access Denied",
      },
    });
  }

  try {
    // Verify the token using jsonwebtoken and the secret from environment variables
    let user = jsonwebtoken.verify(token, process.env.MY_SECRET);

    // If the token is verified, append user data to the request object
    req.user = {
      username: user.username,
      id: user.id,
      email: user.email,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return a 400 status with an error message
    res.status(400).json({
      errors: {
        message: "Invalid token!",
      },
    });
  }
};

// Export the authCheck middleware function
module.exports = { authCheck };
