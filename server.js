import express from "express";
import "dotenv/config"; // 'dotenv' library config allows to access 'ENV' variables.
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";
import ownerRouter from "./routes/ownerRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

// Initialize Express app
const app = express();

// Connect to mongodb database
connectDB();

// Middlewares
app.use(cors());
app.use(
  express.json(),
); /* Middleware tells Express to automatically 'Parse Incoming JSON Request Bodies' and convert into 'Javascript Object'. then, stores it in req.body. 
i.e, request body -> middleware convert 'JSON' into 'Javascript Object'. */

// Routes
app.get("/", (req, res) => {
  res.send("Hello There");
});
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ...`);
});
