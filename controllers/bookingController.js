import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Booking from "../models/BookingModel.js";

export const createBooking = async (req, res) => {
  const { userId } = req.user;
  req.body.user = userId;
  const booking = await Booking.create(req.body);

  res.status(StatusCodes.CREATED).json({ data: booking });
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const updatedBookingStatus = req.body.bookingStatus;

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,

    { bookingStatus: updatedBookingStatus },
    {
      new: true,
    }
  );

  res.status(StatusCodes.CREATED).json({ msg: "updated booking status" });
};

export const getBookingsByUser = async (req, res) => {
  const { userId } = req.user;

  const bookings = await Booking.find({ user: userId }).populate("place");

  res.status(StatusCodes.CREATED).json({ data: bookings });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findOne({ _id: id })
    .populate("review")
    .populate({
      path: "place",
      populate: { path: "owner" },
    });

  res.status(StatusCodes.CREATED).json({ data: booking });
};
export const deleteBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.deleteOne({ _id: id });

  res.status(StatusCodes.OK).json({ msg: "delete booking" });
};

export const getOrders = async (req, res) => {
  const { userId } = req.user;

  const bookings = await Booking.find().populate("place");

  const filterBookings = bookings.filter(
    (booking) => String(booking.place.owner) === userId
  );

  res.status(StatusCodes.OK).json({ data: filterBookings });
};
