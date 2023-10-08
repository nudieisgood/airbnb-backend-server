import { Router } from "express";
import {
  createPlace,
  getPlaceById,
  getPlaces,
  editPlace,
  deletePlace,
  getAllPlaces,
} from "../controllers/placesController.js";
//middlewares
import upload from "../middlewares/multerMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = Router();
router
  .route("/")
  .post(upload.array("photos", 100), authenticateUser, createPlace);
router.route("/").get(getAllPlaces);
router.route("/get-places-by-user").get(authenticateUser, getPlaces);
router.route("/:id").get(getPlaceById);

router
  .route("/:id")
  .get(getPlaceById)
  .patch(upload.array("photos", 100), editPlace)
  .delete(deletePlace);

export default router;
