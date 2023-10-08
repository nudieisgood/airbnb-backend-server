import { StatusCodes } from "http-status-codes";
import Booking from "../models/BookingModel.js";

export const createBooking = async (req, res) => {
  const { userId } = req.user;
  req.body.user = userId;

  const booking = await Booking.create(req.body);

  res.status(StatusCodes.CREATED).json({ data: booking });
};

export const getBookingsByUser = async (req, res) => {
  const { userId } = req.user;

  const bookings = await Booking.find({ user: userId }).populate("place");

  res.status(StatusCodes.CREATED).json({ data: bookings });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findOne({ _id: id }).populate("place");

  res.status(StatusCodes.CREATED).json({ data: booking });
};
