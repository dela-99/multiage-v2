const Message = require("../models/Message");
const { sendUserRequestEmail, sendAutoReplyEmail } = require("../services/emailService");

// Escape regex metacharacters for safe RegExp construction
const regexEscape = (s) => String(s || "").replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const normalizeStatus = (status, isRead = false) => {
  const raw = String(status || "").trim().toLowerCase();

  if (raw === "read" || raw === "contacted" || raw === "closed") {
    return "read";
  }

  if (isRead) {
    return "read";
  }

  return "unread";
};

const normalizePhone = (phone) => {
  // Strip any non-digit characters except a leading +
  let cleaned = String(phone).replace(/(?!^\+)[^\d]/g, "");

  if (cleaned.startsWith("0")) {
    return "233" + cleaned.slice(1);
  }

  if (cleaned.startsWith("+233")) {
    return cleaned.replace("+", "");
  }

  return cleaned;
};

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

    if (!name || !email || !message || !phone) {
      return res.status(400).json({ message: "Name, email, phone, and message are required" });
    }

    const phoneRegex = /^\+?[0-9\s\-()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (kind === "used-device-inquiry" && !deviceRequested) {
      return res.status(400).json({ message: "Device requested is required for used device inquiries" });
    }

    const msg = await Message.create({
      name,
      email,
      phone: normalizePhone(phone),
      service,
      message,
      kind: kind || "contact",
      deviceRequested: deviceRequested || "",
      status: "unread",
      source: source || "website",
    });

    let emailSent = false;
    let emailError = "";

    try {
      await sendUserRequestEmail(msg);
      await sendAutoReplyEmail(msg); // Auto-reply to customer
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
    const { search, status } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = normalizeStatus(status);
    }

    if (search) {
      const escaped = regexEscape(search);
      const r = new RegExp(escaped, "i");
      query.$or = [
        { name: { $regex: r } },
        { email: { $regex: r } },
        { phone: { $regex: r } },
        { service: { $regex: r } },
        { message: { $regex: r } }
      ];
    }

    const messages = await Message.find(query).sort("-createdAt");
    for (const message of messages) {
      const nextStatus = normalizeStatus(message.status, message.isRead);
      if (message.status !== nextStatus || message.isRead !== (nextStatus === "read")) {
        message.status = nextStatus;
        message.isRead = nextStatus === "read";
        await message.save();
      }
    }
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

    const currentStatus = normalizeStatus(msg.status, msg.isRead);

    if (currentStatus !== "read") {
      msg.status = "read";
      msg.isRead = true;
      await msg.save();
    } else if (msg.status !== currentStatus || msg.isRead !== true) {
      msg.status = currentStatus;
      msg.isRead = true;
      await msg.save();
    }

    res.json(msg);
  } catch (err) {
    next(err);
  }
};

// ── @route  PATCH /api/messages/:id/status ───────────────────────
// ── @access Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["unread", "read"].includes(String(status || "").trim().toLowerCase())) {
      return res.status(400).json({ message: "Invalid message status" });
    }
    const normalizedStatus = normalizeStatus(status);
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { status: normalizedStatus, isRead: normalizedStatus === "read" },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
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

module.exports = { createMessage, getMessages, getMessage, updateMessageStatus, deleteMessage };
