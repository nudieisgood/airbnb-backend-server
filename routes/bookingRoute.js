import { Router } from "express";
import {
  createBooking,
  getBookingsByUser,
  getBookingById,
} from "../controllers/bookingController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = Router();

router.route("/").post(authenticateUser, createBooking);
router.route("/").get(authenticateUser, getBookingsByUser);
router.route("/:id").get(authenticateUser, getBookingById);

export default router;
