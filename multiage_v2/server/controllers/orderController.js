const Order   = require("../models/Order");
const Product = require("../models/Product");
const { sendAdminNewOrderNotification } = require("../services/emailService");

// ── @route  POST /api/orders ──────────────────────────────────────
// ── @access Private (logged-in user)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, note } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Verify products exist and calculate total
    let totalPrice = 0;
    const resolvedItems = [];

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.type === "used") {
        return res.status(400).json({ message: `${product.name} is handled through direct inquiry only` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      resolvedItems.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,
        quantity: item.quantity,
        image:    product.image,
      });

      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      user:            req.user._id,
      items:           resolvedItems,
      totalPrice,
      shippingAddress: shippingAddress || {},
      paymentGateway:  "paystack",
      paymentStatus:   "pending",
      note:            note || "",
    });

    // Initialize Paystack Transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.user.email,
        amount: totalPrice * 100,
        currency: "GHS",
        callback_url: "https://multiage.com.gh/checkout/success",
        metadata: { orderId: order._id },
      }),
    });

    const paystackData = await paystackResponse.json();
    if (!paystackResponse.ok) throw new Error(paystackData.message || "Paystack initialization failed");

    sendAdminNewOrderNotification(order, req.user).catch((error) => {
      console.error("Admin order email failed:", error.message);
    });

    res.status(201).json({
      order,
      paymentUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/orders/my ────────────────────────────────────
// ── @access Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image category")
      .sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/orders/:id ───────────────────────────────────
// ── @access Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user",          "name email")
      .populate("items.product", "name image category");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Users can only see their own orders; admins see all
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/orders ───────────────────────────────────────
// ── @access Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user",          "name email")
      .populate("items.product", "name category")
      .sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/orders/:id/status ───────────────────────────
// ── @access Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "delivered") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ── @route  DELETE /api/orders/:id ───────────────────────────────
// ── @access Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus, deleteOrder,
};
