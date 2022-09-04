import express from "express";
import bodyParser from "body-parser";

import { placesRouter, usersRouter } from "./routes";
import { HttpError } from "./models";

const port = 3008;

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

// only runs if our api call didn't get the response back.
// means there's a problem with api route => if the api route is proper
// then obviously it will return some error for sure.
app.use((req, res, next) => {
  const error = new HttpError("Could not found this route", 404);
  // since it's synchronous
  throw error;
});

// middlewear funtion to handle error.
// if the middilewear function has 4 parameters then it will be for error handling(here).
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    status: error.code || 500,
    message: error.message || "An unknown error occured",
  });
});

app.listen(port, () => {
  console.log("listening on port 3008");
});
