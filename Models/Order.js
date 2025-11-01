const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  products: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
