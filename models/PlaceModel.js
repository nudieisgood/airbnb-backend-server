import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
    title: String,
    city: String,
    address: String,
    geoLocation: { lat: String, lng: String },
    photos: [String],
    photosId: [String],
    description: String,
    extraInfo: String,
    checkInTime: Number,
    checkOutTime: Number,
    maxGuests: Number,
    perks: [String],
    surroundingEnv: [String],
    price: Number,
    roomType: {
      type: String,
      enum: [
        "獨立房間",
        "獨棟套房",
        "整套房源",
        "整套私有公寓",
        "整套別墅",
        "露營地",
        "小木屋",
        "迷你屋",
      ],
      default: "獨棟套房",
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Place", PlaceSchema);
