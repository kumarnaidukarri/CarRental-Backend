// ownerRouter handles owner routes.

import express from "express";
import { protectRoute_VerifyJwtToken } from "../middleware/auth.js"; // middleware function
import uploadMiddleware from "../middleware/multer.js"; // multer middleware function for uploads

import {
  addCar,
  changeRoleToOwner,
  getOwnerCars,
} from "../controllers/ownerController.js"; // controller functions

const ownerRouter = express.Router();

ownerRouter.post(
  "/change-role",
  protectRoute_VerifyJwtToken,
  changeRoleToOwner,
);

ownerRouter.post(
  "/add-car",
  protectRoute_VerifyJwtToken,
  uploadMiddleware.single("image"), // keyName is 'image' and keyValue is 'uploaded file car1.jpg' coming from API Call "Form-Data".
  addCar,
); // (Path, verifyJWT Middleware, upload Middleware, Controller function)

ownerRouter.get("/cars", protectRoute_VerifyJwtToken, getOwnerCars);

export default ownerRouter;
