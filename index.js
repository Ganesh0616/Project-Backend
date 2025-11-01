// index.js
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
const allowedOrigins = [
  "http://localhost:3000",                 // local dev React
  "https://powerhouse-frontend-ybst.vercel.app" // deployed frontend (no trailing slash)
];

app.use(express.json());
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps, curl, Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if(!mongoURI){
  console.error("❌ MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/PowerHouseFitHub", productRoutes);
app.use("/PowerHouseFitHub", orderRoutes); 
app.use("/PowerHouseFitHub", authRoutes);

// Error handler for CORS and others
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
