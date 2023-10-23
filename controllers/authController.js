import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customError.js";
import User from "../models/userModel.js";
import { createJWT, comparePW, hashedPW } from "../utlits.js";

export const register = async (req, res) => {
  const isFirstAcc = (await User.countDocuments()) === 0;
  req.body.role = isFirstAcc ? "admin" : "user";

  req.body.password = await hashedPW(req.body.password);
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "Successfully register." });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new UnauthenticatedError("password or email is not correct");
  }

  const isValidUser = await comparePW(req.body.password, user.password);
  if (!isValidUser) {
    throw new UnauthenticatedError("password or email is not correct");
  }

  // const token = createJWT({ userId: user._id, role: user.role });

  const token = createJWT({ userId: user._id, email: user.email });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
  });

  const withoutPassword = user.toRemovePassword();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Successfully login.", user: withoutPassword });
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
  });
  res.status(StatusCodes.OK).json({ msg: "Successfully logout." });
};
