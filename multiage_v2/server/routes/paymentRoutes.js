/**
 * @deprecated Paystack payment gateway — tied to removed store checkout.
 * Routes unmounted in server/index.js.
 */
const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment, paymentWebhook } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/webhook", paymentWebhook);
router.post("/initialize", protect, initializePayment);
router.get("/verify", protect, verifyPayment);

module.exports = router;
