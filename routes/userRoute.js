import { getCurrentUser } from "../controllers/userController.js";

import { Router } from "express";
const router = Router();

router.route("/get-current-user").get(getCurrentUser);

export default router;
