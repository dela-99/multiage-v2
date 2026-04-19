const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment, paymentWebhook } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/webhook", paymentWebhook);
router.post("/initialize", protect, initializePayment);
router.get("/verify", verifyPayment);

module.exports = router;
