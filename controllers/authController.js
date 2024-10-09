import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const createResToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOption = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("jwt", token, cookieOption); // Pastikan token tersimpan di sini

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const firstAccount = (await User.countDocuments()) === 0 ? "admin" : "user";

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    role: firstAccount,
  });

  // Generate OTP
  const otpData = await user.generateOtpCode();

  // Kirim email OTP
  await sendEmail({
    to: user.email,
    subject: "Register Successful",
    html: `
    <!doctype html>
    <html>
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats ${user.username}, registration successful!</h1>
      <p>Please use the OTP code below to verify your account. The OTP code will expire in 5 minutes.</p>
      <p style="text-align:center; background-color:yellow; font-weight:bold; font-size: 30px;">${otpData.otp}</p>
      </div>
      </body>
      </html>
    `,
  });

  // Create response token
  createResToken(user, 201, res);
});

export const regenerateOtpCodeUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate new OTP
  const otpData = await currentUser.generateOtpCode();

  // Kirim email dengan OTP baru
  await sendEmail({
    to: currentUser.email,
    subject: "New OTP Code",
    html: `
    <!doctype html>
    <html>
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats ${currentUser.username}, success in generating a new OTP code!</h1>
      <p>Please use the OTP code below to verify your account. The OTP code will expire in 5 minutes.</p>
      <p style="text-align:center; background-color:yellow; font-weight:bold; font-size: 30px;">${otpData.otp}</p>
      </div>
      </body>
      </html>
    `,
  });

  res.status(200).json({
    success: true,
    message: "OTP has been regenerated and sent to your email",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userData = await User.findOne({ email: req.body.email });

  if (userData && (await userData.comparePassword(req.body.password))) {
    createResToken(userData, 200, res);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.status(200).json({
      message: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({
    success: true,
    message: "Logout success",
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { password, username, email, phoneNumber, address, avatar } = req.body;

  // Ambil pengguna berdasarkan ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Verifikasi password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Password is incorrect");
  }

  // Update profil pengguna dengan data yang baru
  user.username = username || user.username;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;
  user.avatar = avatar || user.avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      avatar: user.avatar,
    },
  });
});
