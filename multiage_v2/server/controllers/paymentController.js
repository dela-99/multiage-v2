const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const {
  isPaystackConfigured,
  initializeTransaction,
  verifyTransaction,
  validatePaystackSignature,
} = require("../services/paystackService");
const { sendPaidOrderConfirmation } = require("../services/emailService");

function buildReference(orderId) {
  return `MAG-${orderId}-${Date.now()}`;
}

function resolveCallbackUrl() {
  return process.env.PAYSTACK_CALLBACK_URL || "https://multiage.com.gh/payment/callback";
}

async function finalizeOrderPayment(order, payment) {
  const wasPaid = order.isPaid;
  let alreadyPaid = false;

  if (payment.status === "success" && !wasPaid) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const freshOrder = await Order.findById(order._id).session(session);
        if (!freshOrder) {
          throw new Error("Order not found");
        }

        if (freshOrder.isPaid) {
          alreadyPaid = true;
          order = freshOrder;
          return;
        }

        for (const item of freshOrder.items) {
          const product = await Product.findById(item.product).session(session);
          if (!product) {
            throw new Error(`Product ${item.product} not found`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          product.stock -= item.quantity;
          await product.save({ session });
        }

        freshOrder.paymentGateway = "paystack";
        freshOrder.paymentReference = payment.reference || freshOrder.paymentReference;
        freshOrder.paymentStatus = payment.status || freshOrder.paymentStatus;
        freshOrder.paymentChannel = payment.channel || freshOrder.paymentChannel;
        freshOrder.isPaid = true;
        freshOrder.paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();

        if (freshOrder.status === "pending") {
          freshOrder.status = "confirmed";
        }

        await freshOrder.save({ session });
        order = freshOrder;
      });
    } finally {
      await session.endSession();
    }

    if (alreadyPaid) {
      return order;
    }

    const user = await User.findById(order.user).select("name email");
    sendPaidOrderConfirmation(order, user).catch((error) => {
      console.error("Paid order confirmation email failed:", error.message);
    });

    return order;
  }

  order.paymentGateway = "paystack";
  order.paymentReference = payment.reference || order.paymentReference;
  order.paymentStatus = payment.status || order.paymentStatus;
  order.paymentChannel = payment.channel || order.paymentChannel;

  if (payment.status === "success") {
    order.isPaid = true;
    order.paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
    if (order.status === "pending") {
      order.status = "confirmed";
    }
  }

  await order.save();

  return order;
}

const initializePayment = async (req, res, next) => {
  try {
    if (!isPaystackConfigured) {
      return res.status(503).json({ message: "Paystack is not configured yet" });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const ownsOrder = String(order.user) === String(req.user._id);
    if (!ownsOrder && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "This order has already been paid" });
    }

    const reference = order.paymentReference || buildReference(order._id);
    const response = await initializeTransaction({
      email: req.user.email,
      amount: order.totalPrice,
      reference,
      callbackUrl: resolveCallbackUrl(),
      metadata: {
        orderId: String(order._id),
        userId: String(req.user._id),
      },
    });

    order.paymentReference = response.data?.reference || reference;
    order.paymentStatus = "initialized";
    order.paymentGateway = "paystack";
    await order.save();

    res.json({
      message: "Payment initialized",
      orderId: String(order._id),
      reference: order.paymentReference,
      authorization_url: response.data?.authorization_url || "",
      access_code: response.data?.access_code || "",
    });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    if (!isPaystackConfigured) {
      return res.status(503).json({ message: "Paystack is not configured yet" });
    }

    const reference = req.query.reference || req.body?.reference || null;
    if (!reference) {
      return res.status(400).json({ message: "reference is required" });
    }

    const response = await verifyTransaction(reference);
    const payment = response.data || {};
    const order = await Order.findOne({ paymentReference: payment.reference });

    if (!order) {
      return res.status(404).json({ message: "Order not found for this payment reference" });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedOrder = await finalizeOrderPayment(order, payment);

    res.json({
      message: payment.status === "success" ? "Payment verified successfully" : "Payment verification completed",
      status: payment.status || null,
      reference: payment.reference || reference,
      order: updatedOrder,
      paid_at: payment.paid_at || null,
      channel: payment.channel || null,
    });
  } catch (err) {
    next(err);
  }
};

const paymentWebhook = async (req, res, next) => {
  try {
    if (!isPaystackConfigured) {
      return res.status(503).json({ message: "Paystack is not configured yet" });
    }

    const signature = req.headers["x-paystack-signature"];
    if (!validatePaystackSignature(req.rawBody || JSON.stringify(req.body || {}), signature)) {
      return res.status(401).json({ message: "Invalid Paystack signature" });
    }

    const event = req.body || {};
    if (event.event !== "charge.success" || !event.data) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const payment = event.data;
    const order = await Order.findOne({
      $or: [
        { paymentReference: payment.reference },
        ...(payment.metadata?.orderId ? [{ _id: payment.metadata.orderId }] : []),
      ],
    });

    if (!order) {
      return res.status(200).json({ received: true, ignored: true });
    }

    await finalizeOrderPayment(order, payment);

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { initializePayment, verifyPayment, paymentWebhook };
