import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);

  const withoutPassword = user.toRemovePassword();

  res.status(StatusCodes.OK).send({ user: withoutPassword });
};
