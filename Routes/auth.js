const express = require("express");
const router = express.Router();
const { Login, Register } = require("../Controllers/authControllers");

// Register & Login
router.post("/register", Register);
router.post("/login", Login);

// ✅ Check username availability
router.get("/check-username/:username", async (req, res) => {
  try {
    const user = await require("../Models/UserSchema").findOne({ username: req.params.username });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

module.exports = router;
