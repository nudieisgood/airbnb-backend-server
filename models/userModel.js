import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    lastName: {
      type: String,
    },
    nickName: String,
    phone: String,
    birth: String,
    address: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    myFavs: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Place",
      },
    ],
    avatar: String,
    avatarPublicId: String,
  },
  { timestamps: true }
);

UserSchema.methods.toRemovePassword = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
