const express = require("express");
const router  = express.Router();
const {
  createMessage, getMessages, getMessage, deleteMessage,
} = require("../controllers/messageController");
const { protect, adminOnly } = require("../middleware/auth");

// Public (contact form)
router.post("/", createMessage);

// Admin
router.get("/",        protect, adminOnly, getMessages);
router.get("/:id",     protect, adminOnly, getMessage);
router.delete("/:id",  protect, adminOnly, deleteMessage);

module.exports = router;
