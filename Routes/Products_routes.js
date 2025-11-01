const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();

const {
  getproduct,
  getsingle,
  addProductsWithFile,
  updateProduct,
  deleteProduct,
  Many_delete,
} = require("../Controllers/Product_Controllers");

const { verifyJWT, adminOnly } = require("../Middleware/verifyJWT");

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "pdf", "mp4"],
  },
});

const upload = multer({ storage });

// Public routes
router.get("/getproduct", getproduct);
router.get("/getsingle/:id", getsingle);

// Admin routes (token + role required)
router.post("/addProducts", verifyJWT, adminOnly, upload.single("file"), addProductsWithFile);
router.put("/updateProduct/:id", verifyJWT, adminOnly, updateProduct);
router.delete("/deleteProduct/:id", verifyJWT, adminOnly, deleteProduct);
router.delete("/manydelete", verifyJWT, adminOnly, Many_delete);

module.exports = router;
