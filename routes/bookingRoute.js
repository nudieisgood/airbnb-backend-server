import { Router } from "express";
import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  getOrders,
  updateBookingStatus,
  deleteBookingById,
} from "../controllers/bookingController.js";
import { createReview } from "../controllers/reviewController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = Router();

router.route("/").post(authenticateUser, createBooking);
router.route("/").get(authenticateUser, getBookingsByUser);

router.route("/orders").get(authenticateUser, getOrders);
router.route("/:id").get(authenticateUser, getBookingById);
router.route("/:id").patch(authenticateUser, updateBookingStatus);
router.route("/:id").delete(authenticateUser, deleteBookingById);
router.route("/:id/reviews").post(authenticateUser, createReview);
export default router;
