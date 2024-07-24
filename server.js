import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.js";
import todoRouter from "./routes/todos.js";
import { errorHandler } from "./middleware/errorHandler/errorHandler.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    Message: "App is running",
  });
});

// auth routes
app.use("/api", todoRouter);
// auth routes
app.use("/api/auth", authRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Use the error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
