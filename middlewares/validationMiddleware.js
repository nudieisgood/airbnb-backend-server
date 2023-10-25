import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
// import Job from "../models/JobModel.js";
import User from "../models/userModel.js";

const withValidationError = (validateValue) => {
  return [
    validateValue,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => error.msg);
        if (errorMessage[0].startsWith("without updated value")) {
          next();
        }
        if (errorMessage[0].startsWith("unauthorized")) {
          throw new UnauthorizedError(errorMessage);
        }
        throw new BadRequestError(errorMessage);
      }
      next();
    },
  ];
};

export const validateUpdateMyPlaceInput = withValidationError([
  body("title").notEmpty().withMessage("title is required."),
  body("address").notEmpty().withMessage("address is required."),
  body("description").notEmpty().withMessage("description is required."),
  body("checkInTime")
    .notEmpty()
    .withMessage("checkInTime is required.")
    .isInt({ min: 0, max: 24 })
    .withMessage("checkInTime should be 0 to 24."),
  body("checkOutTime")
    .notEmpty()
    .withMessage("checkOutTime is required.")
    .isInt({ min: 0, max: 24 })
    .withMessage("checkOutTime should be 0 to 24."),
]);

export const validateAddMyPlaceInput = withValidationError([
  body("title").notEmpty().withMessage("title is required."),
  body("city").notEmpty().withMessage("city is required."),
  body("roomType").notEmpty().withMessage("roomType is required."),
  body("address").notEmpty().withMessage("address is required."),
  body("description").notEmpty().withMessage("description is required."),
  body("checkInTime")
    .notEmpty()
    .withMessage("checkInTime is required.")
    .isInt({ min: 0, max: 24 })
    .withMessage("checkInTime should be 0 to 24."),
  body("checkOutTime")
    .notEmpty()
    .withMessage("checkOutTime is required.")
    .isInt({ min: 0, max: 24 })
    .withMessage("checkOutTime should be 0 to 24."),
]);

export const validateRegisterInput = withValidationError([
  body("name").notEmpty().withMessage("name is required."),
  body("lastName").notEmpty().withMessage("lastName is required."),
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
]);

export const validateUpdateUserInput = withValidationError([
  body("phone")
    .optional({ checkFalsy: true })
    .isLength({ min: 10, max: 10 })
    .withMessage("invalid phone")
    .isNumeric()
    .withMessage("invalid phone"),
  body("birth")
    .optional({ checkFalsy: true })
    .isLength({ min: 8, max: 8 })
    .withMessage("invalid birth"),
]);

export const validateCreateReviewInput = withValidationError([
  body("rating")
    .notEmpty()
    .withMessage("rating is required.")
    .isLength({ min: 1, max: 5 })
    .withMessage("value should be 1 to 5")
    .isNumeric()
    .withMessage("value should be 1 to 5"),
  body("content").notEmpty().withMessage("content is required."),
]);

export const validateCreateBookingInput = withValidationError([
  body("phone")
    .notEmpty()
    .withMessage("phone is required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("invalid phone")
    .isNumeric()
    .withMessage("invalid phone"),
  body("creditCardNum")
    .notEmpty()
    .withMessage("credit card is required.")
    .isLength({ min: 14, max: 14 })
    .withMessage("invalid card number"),
]);
