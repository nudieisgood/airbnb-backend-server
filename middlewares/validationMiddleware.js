import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";

import User from "../models/userModel.js";

export const validateRegisterInput = withValidationError([
  body("name").notEmpty().withMessage("name is required."),
  body("email")
    .notEmpty()
    .withMessage("email is required.")
    .isEmail()
    .withMessage("invalid email format.")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new BadRequestError("email already exists.");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required.")
    .isLength({ min: 8 })
    .withMessage("password should longer than 8 characters."),
  body("location").notEmpty().withMessage("location is required."),
]);
