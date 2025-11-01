const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const productRoutes = require("./Routes/Products_routes");
const orderRoutes = require("./Routes/orderRoutes");
const authRoutes = require("./Routes/auth");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000", // React local dev
    "https://powerhouse-frontend-ybst.vercel.app/", // Vercel frontend
  ],
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

// Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
