const express = require("express");
const pool = require("../database/db.js");
const { authCheck } = require("../middleware/authVerification/verify.js");
const { check, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.post(
  "/todo",
  [check("description", "Must be at least 3 characters long.")],
  authCheck,
  async (req, res) => {
    // Validate description
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Get user id
    const { id } = req.user;

    // Get todo description
    const { description } = req.body;

    // Todo id
    const todoid = uuidv4();

    try {
      const [result] = await pool.query(
        "INSERT INTO todo (todoid, description, user) VALUES (?, ?, ?)",
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
  // Get user id
  const { id } = req.user;

  try {
    const [rows] = await pool.query("SELECT * FROM todo WHERE user=?", [id]);

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
  // Get todo id
  const { todoid } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM todo WHERE todoid=?", [
      todoid,
    ]);

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
  // Get todo id
  const { todoid } = req.body;

  try {
    const [result] = await pool.query("DELETE FROM todo WHERE todoid=?", [
      todoid,
    ]);

    // Check if any rows were deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: {
          message: "Todo item not found or no changes made",
        },
      });
    }

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

module.exports = router;
