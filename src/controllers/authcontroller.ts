import HttpStatusCodes from "../constants/HttpStatusCodes";
import asyncHandler  from "../core/core.async"
import UserModel from "../models/User";
import authService from "../services/authService";
import ApiError from "../utils/ApiError";


const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } =
    req.body;
  // Check if user already exists
  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      message: "User already exists",
    });
  }
  const user = await authService.registerUser(
    email,
    firstName,
    lastName,
    phone,
    password
  );
  res.status(HttpStatusCodes.CREATED).json({
    success: true,
    data:user,
    message: "User registered successfully. Please log in.",
  });

});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate if user exist in our database
  
  const user = await authService.loginUser(email, password);
  res.status(HttpStatusCodes.OK).json({
    success: true,
    data: user,
    message: "User loggged in successfully. Please log in.",
  });
});

export default {
  register,
  login
};