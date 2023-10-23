import {
  getCurrentUser,
  addToLove,
  removeLove,
  updateCurrentUser,
} from "../controllers/userController.js";
import upload from "../middlewares/multerMiddleware.js";
import { Router } from "express";
const router = Router();

router.route("/get-current-user").get(getCurrentUser);
router.route("/add-to-love/:placeId").get(addToLove);
router.route("/remove-love/:placeId").get(removeLove);

router.route("/update-user").patch(upload.single("avatar"), updateCurrentUser);
// router.route("/update-user").patch(upload.single("avatar"), updateCurrentUser);

export default router;
