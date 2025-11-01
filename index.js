const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const productRoutes = require("./Routes/Products_routes");
const orderRoutes = require("./Routes/orderRoutes");
const authRoutes = require("./Routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/PowerHouseFitHub", productRoutes);
app.use("/PowerHouseFitHub", orderRoutes); 
app.use("/PowerHouseFitHub", authRoutes);


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
