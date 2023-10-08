import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Types.ObjectId, ref: "Place", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  price: Number,
  numOfGuest: Number,
  numOfNights: Number,
});

export default mongoose.model("Booking", BookingSchema);
