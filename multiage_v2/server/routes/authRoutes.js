const express = require("express");
const router  = express.Router();
const {
  register, login, getMe, getAllUsers, deleteUser,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

// Public
router.post("/register", register);
router.post("/login",    login);

// Private
router.get("/me", protect, getMe);

// Admin
router.get("/users",        protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
