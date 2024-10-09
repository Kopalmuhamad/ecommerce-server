import express from "express";
import {
  addToCart,
  getAllCarts,
  getCartById,
  getCartByItemId,
  updateCartByItemId,
  deleteCartItemById, // Tambahkan ini
} from "../controllers/cartController.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware untuk melindungi rute
router.use(protectedMiddleware);

// Rute untuk CRUD Cart
router.post("/", addToCart); // Menambahkan item ke cart
router.get("/", getAllCarts); // Mendapatkan semua cart
router.get("/:id", getCartById); // Mendapatkan cart berdasarkan ID
router.put("/item/:itemId", updateCartByItemId); // Rute untuk memperbarui item di cart berdasarkan itemId
router.delete("/item/:itemId", deleteCartItemById); // Rute untuk menghapus item dari cart berdasarkan itemId
router.get("/item/:itemId", getCartByItemId); // Menambahkan rute ini

export default router;
