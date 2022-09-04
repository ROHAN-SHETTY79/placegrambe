import express from "express";
import { check } from "express-validator";
import { getAllUsers, signUp, login } from "../controllers/users.controller";
const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/signUp",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() //Rohan@rohan.com => rohan@rohan.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signUp
);

router.post("/login", login);

export { router as usersRouter };
