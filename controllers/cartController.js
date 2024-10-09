import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js"; // Pastikan untuk mengimpor model Product
import asyncHandler from "../middlewares/asyncHandler.js"; // Impor asyncHandler

// Menambahkan item ke keranjang
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Ambil user ID dari token

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Buat keranjang baru jika tidak ada
    cart = new Cart({ userId });
  }

  // Tambahkan atau perbarui item di keranjang
  await cart.addItem(productId, quantity);

  res.status(201).json(cart);
});

// Mendapatkan semua cart
export const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find().populate("userId", "name email"); // Populasi data pengguna
  res.json(carts);
});

// Mendapatkan cart berdasarkan ID
export const getCartById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cart = await Cart.findById(id).populate("userId", "name email");

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json(cart);
});

// Mendapatkan Cart Item Berdasarkan Item ID
export const getCartByItemId = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Mencari cart yang memiliki item dengan _id yang cocok
  const cart = await Cart.findOne({ "items._id": itemId }).populate(
    "userId",
    "email"
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Mencari item yang sesuai berdasarkan _id
  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json({
    item: item,
  });
});

// Memperbarui item di dalam cart berdasarkan itemId
export const updateCartByItemId = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body; // Mendapatkan quantity yang baru dari request

  // Mencari cart yang memiliki item dengan _id yang cocok di dalam array items
  const cart = await Cart.findOne({ "items._id": itemId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Mencari item yang sesuai berdasarkan _id
  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Update quantity dan totalAmount dari item tersebut
  item.quantity = quantity;
  item.totalAmount = item.price * quantity;
  item.updatedAt = Date.now(); // Update updatedAt untuk item tersebut

  await cart.save(); // Simpan perubahan pada cart

  // Hanya mengembalikan item yang diperbarui
  res.json({
    message: "Item updated successfully",
    item: {
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      totalAmount: item.totalAmount,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
  });
});

// Menghapus item dari cart berdasarkan itemId
export const deleteCartItemById = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Mencari cart yang memiliki item dengan _id yang cocok di dalam array items
  const cart = await Cart.findOne({ "items._id": itemId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Mencari index dari item yang sesuai di dalam array items
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Menghapus item dari array items menggunakan splice
  cart.items.splice(itemIndex, 1);

  await cart.save(); // Simpan perubahan pada cart

  res.json({ message: "Item removed successfully", cart });
});
