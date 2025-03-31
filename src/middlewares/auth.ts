import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import ApiError from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: {
    user_id : string,
    email : string
  } 
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return next(
      new ApiError(
        HttpStatusCodes.FORBIDDEN,
        "A token is required for authentication"
      )
    );
  }

  try {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthRequest["user"];
   

    req.user  = decoded;
  } catch (error) {
    console.log(error);
    return next(new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid Token"))
  }

  return next();
};

export default verifyToken;
