// ownerRouter handles owner routes.

import express from "express";
import { protectRoute_VerifyJwtToken } from "../middleware/auth.js"; // middleware function
import uploadMiddleware from "../middleware/multer.js"; // multer middleware function for uploads

import { addCar, changeRoleToOwner } from "../controllers/ownerController.js"; // controller function

const ownerRouter = express.Router();

ownerRouter.post(
  "/change-role",
  protectRoute_VerifyJwtToken,
  changeRoleToOwner,
);

ownerRouter.post(
  "/add-car",
  protectRoute_VerifyJwtToken,
  uploadMiddleware.single("image"),
  addCar,
); // (Path, verifyJWT Middleware, upload Middleware, Controller function)

export default ownerRouter;
