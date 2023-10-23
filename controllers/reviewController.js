import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Booking from "../models/BookingModel.js";
import Review from "../models/ReviewModel.js";
import Place from "../models/PlaceModel.js";

export const createReview = async (req, res) => {
  const { userId } = req.user;
  const { id: bookingId } = req.params;

  req.body.author = userId;
  const review = await Review.create(req.body);

  const booking = await Booking.findById(bookingId);
  const placeId = booking.place.toString();

  const place = await Place.findById(placeId);
  place.reviews.push(review);
  booking.review = review;
  await booking.save();
  await place.save();

  res.status(StatusCodes.CREATED).json({ data: "ok" });
};
