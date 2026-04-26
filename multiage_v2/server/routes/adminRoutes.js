const express = require("express");
const router = express.Router();
const { replyToUserEmail } = require("../controllers/adminController");
const { protect, emailReplyRolesOnly } = require("../middleware/auth");

router.post("/reply-email", protect, emailReplyRolesOnly, replyToUserEmail);

module.exports = router;
