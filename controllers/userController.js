import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Place from "../models/PlaceModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);

  const withoutPassword = user.toRemovePassword();

  res.status(StatusCodes.OK).send({ user: withoutPassword });
};

export const addToLove = async (req, res) => {
  const { userId } = req.user;
  const { placeId } = req.params;
  const user = await User.findById(userId);

  user.myFavs.push(placeId);
  await user.save();

  res.status(StatusCodes.OK).send({ msg: "ok" });
};

export const removeLove = async (req, res) => {
  const { userId } = req.user;
  const { placeId } = req.params;

  await User.findByIdAndUpdate(userId, { $pull: { myFavs: placeId } });

  res.status(StatusCodes.OK).send({ msg: "deleted" });
};

export const updateCurrentUser = async (req, res) => {
  const newUser = { ...req.body };

  delete newUser.password;
  delete newUser.email;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);

    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
