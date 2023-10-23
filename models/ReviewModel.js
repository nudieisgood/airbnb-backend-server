import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    content: String,
    rating: Number,
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
