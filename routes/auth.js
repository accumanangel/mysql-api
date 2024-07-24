import express from "express";
import pool from "../database/db.js";
import { check, validationResult } from "express-validator";
import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

router.post(
  "/signup",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Should be atleast 4 characters").isLength({
      min: 4,
    }),
    check("name", "Should be alteast 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //destructure request body
    const { email, password, name } = req.body;

    try {
      // Check if the email already exists
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          error: {
            message: "Email already exists",
          },
        });
      }

      // Hash the password before storing it
      const hashedPassword = await argon2.hash(password, 10);

      // insert user into table
      try {
        const [result] = await pool.query(
          "INSERT INTO users (email,password,name) VALUES (?, ?,?)",
          [email, hashedPassword, name]
        );
        res.status(201).json({
          message: "Account created!",
        });
      } catch (error) {
        res.status(500).json({
          error: {
            message: error.message,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
);

router.post(
  "/signin",
  [
    check("email", "Enter valid email.").isEmail(),
    check("password", "Password should be atleast 3 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email: inputEmail, password: inputPwd } = req.body;

    try {
      const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
        inputEmail,
      ]);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Invalid Credentials",
        });
      }

      // destructure user data
      const [user] = result;
      const { userid, email: userEmail, password: userPwd, name } = user;

      //check password
      let isMatch = await argon2.verify(userPwd, inputPwd);

      if (!isMatch) {
        return res.status(404).json({
          message: "Invalid Credentials!",
        });
      }

      let token = jsonwebtoken.sign(
        { username: name, id: userid, email: userEmail },
        process.env.MY_SECRET,
        { expiresIn: "10min" }
      );

      res.status(200).json({
        message: "User authenticated successfully",
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: `Internal Server Error-${error}`,
        },
      });
    }
  }
);

export default router;
