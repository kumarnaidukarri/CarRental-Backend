// bookingRouter handles all booking routes.

import express from "express";

// my modules
import { protectRoute_VerifyJwtToken } from "../middleware/auth.js";
import {
  checkAvailabilityOfCar,
  createBooking,
  getUserBookings,
  getOwnerBookings,
  changeBookingStatus,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);

bookingRouter.post("/create", protectRoute_VerifyJwtToken, createBooking);

bookingRouter.get("/user", protectRoute_VerifyJwtToken, getUserBookings);

bookingRouter.get("/owner", protectRoute_VerifyJwtToken, getOwnerBookings);

bookingRouter.post(
  "change-status",
  protectRoute_VerifyJwtToken,
  changeBookingStatus,
);

export default bookingRouter;
