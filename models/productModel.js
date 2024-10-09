import mongoose from "mongoose";
import validator from "validator";
import randomstring from "randomstring";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be positive"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    min: [0, "Stock must be at least 0"],
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  images: [
    {
      type: String,
      required: [true, "Product image is required"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Update updatedAt field before saving the document
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
