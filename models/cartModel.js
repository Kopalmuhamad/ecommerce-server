import mongoose from "mongoose";

// Schema untuk item di dalam Cart
const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Referensi ke model Product
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Minimal jumlah yang bisa dibeli adalah 1
    },
    price: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      default: function () {
        return this.price * this.quantity; // Total dihitung berdasarkan price dan quantity
      },
    },
    createdAt: {
      type: Date,
      default: Date.now, // Waktu pembuatan item
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Waktu terakhir diupdate
    },
  },
  { _id: true } // Mengaktifkan pembuatan id otomatis untuk sub-document
);

// Schema utama untuk Cart
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referensi ke model User
    required: true,
    unique: true, // Pastikan hanya ada satu cart per user
  },
  items: [CartItemSchema], // Array yang dapat berisi lebih dari satu item
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware untuk memperbarui updatedAt saat item diupdate
CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method untuk menambahkan item ke cart
CartSchema.methods.addItem = async function (productId, quantity) {
  const Product = mongoose.model("Product");
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const price = product.price;

  // Mencari apakah item dengan productId yang sama sudah ada di keranjang
  const existingItem = this.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    // Jika item sudah ada, update jumlah dan total amount
    existingItem.quantity += quantity;
    existingItem.totalAmount = existingItem.price * existingItem.quantity;
    existingItem.updatedAt = Date.now();
  } else {
    // Jika item baru, tambahkan ke dalam array items
    this.items.push({
      productId,
      quantity,
      price,
      totalAmount: price * quantity,
    });
  }

  return this.save(); // Simpan perubahan pada keranjang
};

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
