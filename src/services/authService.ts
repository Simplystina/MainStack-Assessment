import HttpStatusCodes from "../constants/HttpStatusCodes";
import UserModel from "../models/User";
import ApiError from "../utils/ApiError";
import { generateVerificationOTP } from "../utils/otp";
const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  password: string,
)  => {
  const verificationOtp = generateVerificationOTP();
  //create user in our database
  const userData = {
    email,
    firstName,
    lastName,
    phone,
    password,
    verificationOTP: verificationOtp,
    verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000,
  };
  const user = await UserModel.create(userData);
  // Send verification email to the user (I could have implemented this is I had set up mailing)
  //   
  const userWithoutPassword = user.toObject() as any;
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

const loginUser = async(email:string, password:string)=>{
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(HttpStatusCodes.NOT_FOUND, "User doesn't exist");
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(HttpStatusCodes.NOT_FOUND, "Wrong Password Entered");
  }
  const token = user.getSignedJwtToken();
  //Remove password
  const userData = user.toObject() as any;
  userData.token = token;
  delete userData.password;

  return userData
}

export default {
  registerUser,
  findUserByEmail,
  loginUser,
};