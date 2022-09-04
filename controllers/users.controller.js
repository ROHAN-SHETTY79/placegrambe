import { v4 as uuidv4 } from "uuid";
import { check, validationResult } from "express-validator";
import { HttpError } from "../models";

const users = [
  {
    id: "u1",
    userName: "Rohan Shetty",
    email: "r@gmail.com",
    password: "Rohan@123",
  },
  {
    id: "u2",
    userName: "Rohit Shetty",
    email: "rohit@gmail.com",
    password: "Rohit@123",
  },
];

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Rohan Shetty",
    email: "r@gmail.com",
    password: "Rohan@123",
  },
];

export const getAllUsers = (req, res, next) => {
  res.status(200).json({
    result: DUMMY_USERS,
  });
};

export const signUp = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    throw new HttpError("Validation error", 422);
  }

  const payload = req.body;
  const isAlreadyPresent = DUMMY_USERS.find(
    (user) => user.email === payload.email
  );

  if (isAlreadyPresent) {
    throw new HttpError("Could not sign up, this email already in use.", 422);
  } else {
    DUMMY_USERS.push({ ...payload, id: uuidv4() });
    res.status(201).json({
      result: DUMMY_USERS,
    });
  }
};

export const login = (req, res, next) => {
  const payload = req.body;
  const loggingInUser = DUMMY_USERS.find(
    (user) => user.email === payload.email
  );

  if (loggingInUser || loggingInUser.password !== payload.password) {
    throw new HttpError(
      "could not identify user, looks like username / email entered is wrong",
      404
    );
  }

  res.status(200).json({
    message: "user logged in successfully",
  });
};
