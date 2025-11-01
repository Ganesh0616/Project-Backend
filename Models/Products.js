const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: String,
  description: { type: String, required: true },
  category: { type: [String], required: true },
  weight: { type: String, required: true },
  gender: String,
  stock: { type: String, required: true },
  imageurl: String,
  publicId: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
