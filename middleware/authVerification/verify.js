import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authCheck = async (req, res, next) => {
  let token = req.header("auth-token");

  if (!token) {
    return res.status(400).json({
      error: {
        message: "Access Denied",
      },
    });
  }

  try {
    let user = jsonwebtoken.verify(token, process.env.MY_SECRET);

    // if verified append user to request body
    req.user = {
      username: user.username,
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(400).json({
      errors: {
        message: "Invalid token!",
      },
    });
  }
};
