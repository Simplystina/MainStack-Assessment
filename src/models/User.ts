import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  isVerified: boolean;
  TokenExpire: number | null;
  Token: number | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: number | null;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
  getSignedJwtToken: () => string;
} 
interface IUserMethods {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
  getSignedJwtToken: () => string;
}
type UserModel = IUser & IUserMethods;

//const userSchema = new Schema<IUser>(userSchemaFields, { timestamps: true });
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your Email address"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Please enter a valid Email address",
      ],
    },
    phone: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please A Valid Password is Required'],
      select: false,
    },
    TokenExpire: {
      type: Number,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    Token: {
      type: Number,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: { type: Number, select: false },
  },
  { timestamps: true }
);

// Encrypt password using Bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      user_id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET!
  );
};

//const UserModel = mongoose.model<User>('Users', userSchema);
// Create the model
const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
