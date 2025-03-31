import express from "express";
import validate from "../middlewares/validate";
import authValidation from "../validation/authValidation";
import authcontroller from "../controllers/authcontroller";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authcontroller.register
);

router.post("/login", validate(authValidation.login), authcontroller.login);

export default router;

