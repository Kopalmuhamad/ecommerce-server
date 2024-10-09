import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// Create a new product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, brand, images } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    brand,
    images,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    products,
  });
});

// Get a single product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update a product by ID
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, brand, images } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock !== undefined ? stock : product.stock;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.images = images || product.images;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// Delete a product by ID
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Menghapus produk berdasarkan ID
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
