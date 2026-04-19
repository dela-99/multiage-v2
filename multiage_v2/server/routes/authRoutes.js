const express = require("express");
const router  = express.Router();
const {
  register, login, googleLogin, getMe, getAllUsers, deleteUser, changePassword,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");
const { authLimiter } = require("../middleware/security");

// Public (stricter rate limit on auth to reduce brute-force / credential stuffing)
router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);
router.post("/google",   authLimiter, googleLogin);

// Private
router.get("/me", protect, getMe);
router.put("/password", protect, changePassword);

// Admin
router.get("/users",        protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
