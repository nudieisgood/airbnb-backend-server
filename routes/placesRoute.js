import { Router } from "express";
import {
  createPlace,
  getPlaceById,
  getPlaces,
  editPlace,
  deletePlaceById,
  getAllPlaces,
  getFavPlaces,
} from "../controllers/placesController.js";
//middlewares
import upload from "../middlewares/multerMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  validateUpdateMyPlaceInput,
  validateAddMyPlaceInput,
} from "../middlewares/validationMiddleware.js";

const router = Router();
router
  .route("/")
  .post(
    upload.array("photos", 100),
    validateAddMyPlaceInput,
    authenticateUser,
    createPlace
  );
router.route("/").get(getAllPlaces);
router.route("/get-places-by-user").get(authenticateUser, getPlaces);
router.route("/my-favs").get(authenticateUser, getFavPlaces);

router
  .route("/:id")
  .get(getPlaceById)
  .patch(upload.array("photos", 100), validateUpdateMyPlaceInput, editPlace)
  .delete(deletePlaceById);

export default router;
