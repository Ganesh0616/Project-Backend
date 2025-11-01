const Order = require("../Models/Order");

// Get all orders (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order (Admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Place order (User) — COD only
const placeOrder = async (req, res) => {
  try {
    const { userName, products, totalAmount } = req.body;

    if (!userName || !products || products.length === 0) { 
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = new Order({
      userName,
      products,
      totalAmount,
      paymentMethod: "COD", // force COD
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({ message: "Server error while placing order" });
  }
};

// Get orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const username = req.user.username; // decoded from JWT
    const orders = await Order.find({ userName: username });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

module.exports = {
  getOrders,
  deleteOrder,
  updateOrderStatus,
  placeOrder,
  getUserOrders,
};
