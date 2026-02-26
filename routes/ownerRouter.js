// ownerRouter handles owner routes.

import express from "express";
import { protectRoute_VerifyJwtToken } from "../middleware/auth.js"; // middleware function
import { changeRoleToOwner } from "../controllers/ownerController.js"; // controller function

const ownerRouter = express.Router();

ownerRouter.post(
  "/change-role",
  protectRoute_VerifyJwtToken,
  changeRoleToOwner,
);

export default ownerRouter;
