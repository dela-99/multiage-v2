const Message = require("../models/Message");
const { sendUserRequestEmail } = require("../services/emailService");

// ── @route  POST /api/messages ────────────────────────────────────
// ── @access Public (contact form)
const createMessage = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      message,
      kind,
      deviceRequested,
      source,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    if (kind === "used-device-inquiry" && !deviceRequested) {
      return res.status(400).json({ message: "Device requested is required for used device inquiries" });
    }

    const msg = await Message.create({
      name,
      email,
      phone,
      service,
      message,
      kind: kind || "contact",
      deviceRequested: deviceRequested || "",
      source: source || "website",
    });

    let emailSent = false;
    let emailError = "";

    try {
      await sendUserRequestEmail(msg);
      emailSent = true;
    } catch (error) {
      emailError = error.message || "Failed to send service request email";
      console.error("Service request email failed:", emailError);
    }

    res.status(201).json({
      message: emailSent ? "Message sent successfully" : "Message saved, but email notification failed",
      id: msg._id,
      emailSent,
      ...(emailError ? { emailError } : {}),
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/messages ─────────────────────────────────────
// ── @access Admin
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort("-createdAt");
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/messages/:id ────────────────────────────────
// ── @access Admin
const getMessage = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    // Mark as read
    if (!msg.isRead) {
      msg.isRead = true;
      await msg.save();
    }

    res.json(msg);
  } catch (err) {
    next(err);
  }
};

// ── @route  DELETE /api/messages/:id ─────────────────────────────
// ── @access Admin
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    await msg.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createMessage, getMessages, getMessage, deleteMessage };
