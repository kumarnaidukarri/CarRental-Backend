/* 'Routes folder' contains all paths.
 */
import express from "express";
import {
  registerUser,
  loginUser,
  getUserDataFromToken,
} from "../controllers/userController.js"; // controller functions
import { protectRoute_VerifyJwtToken } from "../middleware/auth.js"; // middleware function

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/userdata", protectRoute_VerifyJwtToken, getUserDataFromToken); // (path, middleware, ReqHandler)

export default userRouter;
