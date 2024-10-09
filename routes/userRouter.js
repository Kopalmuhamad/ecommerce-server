import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// !All Users
//? get
// /users
router.get("/", protectedMiddleware, adminMiddleware, getAllUsers);

export default router;
