import express from "express";
import pool from "../database/db.js";
import { authCheck } from "../middleware/authVerification/verify.js";
import { check, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post(
  "/todo",
  [check("description", "Must be atleast 3 characters long.")],
  authCheck,
  async (req, res) => {
    // validate description
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // get user id
    const { id } = req.user;

    // get todo description
    const { description } = req.body;

    // todo id
    const todoid = uuidv4();

    try {
      const [result] = await pool.query(
        "INSERT INTO todo (todoid,description,user) VALUES (?,?,?)",
        [todoid, description, id]
      );

      res.status(201).json({
        message: "Todo created!",
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
);

router.get("/todos", authCheck, async (req, res) => {
  // get user id
  const { id } = req.user;

  try {
    const [rows] = await pool.query("SELECT * FROM  todo WHERE user=?", [id]);

    // console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
});

router.get("/todo", authCheck, async (req, res) => {
  // get user id
  const { todoid } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM  todo WHERE todoid=?", [
      todoid,
    ]);

    // console.log(rows.length);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
});

router.delete("/todo", authCheck, async (req, res) => {
  // get user id
  const { todoid } = req.body;

  try {
    const [result] = await pool.query("DELETE FROM  todo WHERE todoid=?", [
      todoid,
    ]);

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: {
          message: "Todo item not found or no changes made",
        },
      });
    }

    // console.log(rows);
    res.status(200).json({
      message: "Item deleted!",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
});

router.put("/todo", authCheck, async (req, res) => {
  const { todoid, description, iscomplete } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE todo SET description = ?, iscomplete = ? WHERE todoid = ?",
      [description, iscomplete, todoid]
    );

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: {
          message: "Todo item not found or no changes made",
        },
      });
    }

    res.status(200).json({
      message: "Item updated!",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
});

export default router;
