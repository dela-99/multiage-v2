const express = require("express");
const router  = express.Router();
const {
  createMessage, getMessages, getMessage, updateMessageStatus, deleteMessage,
} = require("../controllers/messageController");
const { protect, adminOnly } = require("../middleware/auth");
const { messageLimiter } = require("../middleware/security");

// Public (contact form)
router.post("/", messageLimiter, createMessage);

// Admin
router.get("/",        protect, adminOnly, getMessages);
router.get("/:id",     protect, adminOnly, getMessage);
router.patch("/:id/status", protect, adminOnly, updateMessageStatus);
router.delete("/:id",  protect, adminOnly, deleteMessage);

module.exports = router;
