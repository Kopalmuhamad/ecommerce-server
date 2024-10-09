import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import OtpCode from "./otpCode.js";
import randomstring from "randomstring";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [3, "Username must be at least 3 characters"],
    unique: [true, "Username already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters"],
  },
  address: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "Phone number already exists"],
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOtpCode = async function () {
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  let now = new Date();

  const otpCode = await OtpCode.findOneAndUpdate(
    { user: this._id },
    {
      otp,
      validUntil: now.setMinutes(now.getMinutes() + 5),
    },
    { new: true, upsert: true }
  );
  return otpCode;
};

const User = mongoose.model("User", userSchema);
export default User;
