// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http"); // adapter

dotenv.config();

const productRoutes = require("./Routes/Products_routes");
const orderRoutes = require("./Routes/orderRoutes");
const authRoutes = require("./Routes/auth");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://powerhouse-frontend-ybst.vercel.app" // no trailing slash
];

app.use(express.json());
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS origin denied"), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/PowerHouseFitHub", productRoutes);
app.use("/PowerHouseFitHub", orderRoutes);
app.use("/PowerHouseFitHub", authRoutes);

// Basic health-check route (useful for debugging)
app.get("/api/healthz", (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ======= MONGODB connection (keep outside handler so it reuses connection) =======
const mongoURI = process.env.MONGO_URI;
if(!mongoURI){
  console.error("❌ MONGO_URI is not set");
} else {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
}

// ======= EXPORT handler for Vercel =======
module.exports = app;
module.exports.handler = serverless(app);
