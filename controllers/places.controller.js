import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../models";
import { getCoordsForAddress } from "../util/location";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Maranakatte Brahmalingeshwara Temple",
    description: "Temple at Udupi",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipP5S6Mg_Xf81a999SaP8Dd50xrCnAsEZt0xgSvA=s1600-w400",
    address:
      "Maranakatte Post, Chittur Village, Kundapura Taluk, Udupi, Karnataka 576233",
    location: {
      lat: 13.7251933,
      lng: 75.0568226,
    },
    creator: "u1",
  },
];

export const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    const error = new HttpError(
      "Couldn't find a place for the provided place id",
      404
    );
    return next(error);
  }
  res.json({ result: place });
};

export const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const userPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (!userPlaces.length) {
    const error = new HttpError(
      "Couldn't find a place for the provided user id",
      404
    );
    return next(error);
  }
  res.json({ result: userPlaces });
};

export const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Validation error", 422);
  }
  // post will have a request body
  const payload = req.body;
  const { title, description, address, creator } = payload;
  const coordinates = getCoordsForAddress(address);
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

export const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Validation error", 422);
  }
  const placeId = req.params.placeId;
  const placeDetails = req.body;

  const placeToUpdate = DUMMY_PLACES.find((place) => place.id === placeId);
  const placeToUpdateIndex = DUMMY_PLACES.findIndex(
    (place) => place.id === placeId
  );

  if (placeToUpdateIndex >= 0) {
    const upadtedPlaceDetails = {
      ...placeToUpdate,
      title: placeDetails.title,
      description: placeDetails.description,
    };
    DUMMY_PLACES[placeToUpdateIndex] = upadtedPlaceDetails;
    // not created anything new
    res.status(200).json({ result: DUMMY_PLACES });
  } else {
    res.status(200).json({
      message: "Couldn't find a place for the provided place id to update",
    });
  }
};

export const deletePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const placeToUpdateIndex = DUMMY_PLACES.findIndex(
    (place) => place.id === placeId
  );
  if (placeToUpdateIndex >= 0) {
    DUMMY_PLACES.splice(placeToUpdateIndex, 1);
    res.status(201).json({ places: DUMMY_PLACES });
  } else {
    res.status(404).json({
      message: "Couldn't find a place for the provided place id to delete",
    });
  }
};
