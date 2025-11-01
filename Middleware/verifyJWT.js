const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

// Verify token
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "Access denied. Token missing." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "You are not admin" });
  next();
};

module.exports = { verifyJWT, adminOnly };
