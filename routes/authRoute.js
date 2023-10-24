import { logout, register, login } from "../controllers/authController.js";
import { Router } from "express";
const router = Router();

// validation Middleware
import { validateRegisterInput } from "../middlewares/validationMiddleware.js";

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 mins" },
});

router.route("/register").post(apiLimiter, validateRegisterInput, register);
router.route("/login").post(apiLimiter, login);
router.route("/logout").get(logout);

export default router;
