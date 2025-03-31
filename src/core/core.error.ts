import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { CustomError, ValidationError, ErrorType } from "../types/error";


const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err)
  let error = new ApiError(err.statusCode as HttpStatusCodes, err.message);

  if (process.env.MODE !== "production") {
    console.error(err);
  }

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid resource ID: ${err.value}`;
    error = new ApiError(HttpStatusCodes.BAD_REQUEST, message);
  }

  // Handle Mongoose duplicate key error
  if (err.statusCode === 11000) {
    error = new ApiError(
      HttpStatusCodes.BAD_REQUEST,
      "Duplicate field value entered"
    );
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new ApiError(HttpStatusCodes.BAD_REQUEST, message);
  }
  //console.log(error,"error")
  res.status(error.statusCode).json({
    success: false,
    status: "error",
    error: error.message || "Server Error",
  });
};

export default errorHandler;
