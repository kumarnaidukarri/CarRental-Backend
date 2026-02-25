import express from "express";
import "dotenv/config"; // 'dotenv' library config allows to access 'ENV' variables.
import cors from "cors";
import connectDB from "./configs/db.js";

// Initialize Express app
const app = express();

// Connect to mongodb database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // all requests will pass into this middleware prior to server.

// Routes
app.get("/", (req, res) => {
  res.send("Hello There");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ...`);
});
