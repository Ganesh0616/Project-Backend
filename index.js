// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");

dotenv.config();

const productRoutes = require("./Routes/Products_routes");
const orderRoutes = require("./Routes/orderRoutes");
const authRoutes = require("./Routes/auth");

const app = express();

// ===== Strip /api prefix middleware (Option B) =====
// Makes requests like /api/PowerHouseFitHub/... appear to Express as /PowerHouseFitHub/...
app.use((req, res, next) => {
  if (req.url && req.url.startsWith("/api/")) {
    req.url = req.url.replace(/^\/api/, "");
    if (req.originalUrl) req.originalUrl = req.originalUrl.replace(/^\/api/, "");
  } else if (req.url === "/api") {
    req.url = "/";
    if (req.originalUrl) req.originalUrl = "/";
  }
  next();
});

// CORS + JSON
const allowedOrigins = [
  "http://localhost:3000",
  "https://powerhouse-frontend-ybst.vercel.app"
];

app.use(express.json());
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow curl/postman/no-origin
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS origin denied: " + origin), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// request logger (helps debug routing & crashes)
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${req.url} Host: ${req.headers.host}`);
  next();
});

// ===== Mount routers (unchanged; router files must use relative paths) =====
app.use("/PowerHouseFitHub", productRoutes);
app.use("/PowerHouseFitHub", orderRoutes);
app.use("/PowerHouseFitHub", authRoutes);

// public health-check (accessible at /api/healthz)
app.get("/api/healthz", (req, res) => res.json({ ok: true }));

// helpful 404 fallback if route not matched
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found - request reached function but no matching route found",
    method: req.method,
    path: req.originalUrl
  });
});

// central error handler
app.use((err, req, res, next) => {
  console.error("[ERR]", err && err.stack ? err.stack : err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ===== Mongo connection (serverless-friendly) =====
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.warn("⚠️ MONGO_URI is not set - DB will not connect in this environment.");
} else {
  // Reuse existing connection if available (warm starts)
  if (!global.__mongoClientPromise) {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("✅ MongoDB connected"))
      .catch(err => {
        // log error but don't exit (serverless should still boot so logs are available)
        console.error("❌ MongoDB connection error:", err && err.stack ? err.stack : err);
      });
    global.__mongoClientPromise = mongoose;
  } else {
    console.log("♻️ Reusing existing Mongo connection");
  }
}

// Export app and serverless handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
