import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  photosId: [String],
  description: String,
  extraInfo: String,
  checkInTime: Number,
  checkOutTime: Number,
  maxGuests: Number,
  perks: [String],
  price: Number,
});

export default mongoose.model("Place", PlaceSchema);
