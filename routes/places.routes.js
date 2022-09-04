import express from "express";
import { check } from "express-validator";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} from "../controllers/places.controller.js";

const router = express.Router();

/*
'/' here is nothing but '/api/places' (check app.js file)
hence we don't need to like /api/places hever here '/' is enough
*/

router.get("/:placeId", getPlaceById);

router.get("/user/:userId", getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlaceById
);

router.delete("/:placeId", deletePlaceById);

export { router as placesRouter };
