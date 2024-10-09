import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  regenerateOtpCodeUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// !Register
//? post
// /register
router.post("/register", registerUser);

// !Login
//? post
// /login
router.post("/login", loginUser);

//! Logout
//? get
// /logout
router.get("/logout", protectedMiddleware, logoutUser);

//! Get Current User
//? get
// /getUser
router.get("/getUser", protectedMiddleware, getUser);

//! Regenerate Otp Code
//? post
// /getUser
router.post("/generateOtpCode", protectedMiddleware, regenerateOtpCodeUser);

//! Update Profile
//? put
// /updateProfile
router.put("/updateProfile", protectedMiddleware, updateUserProfile);

export default router;
