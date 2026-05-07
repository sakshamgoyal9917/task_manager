const express = require("express");
const { signup, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes — no auth needed
router.post("/signup", signup);
router.post("/login", login);

// Protected route — must be logged in
router.get("/me", protect, getMe);

module.exports = router;