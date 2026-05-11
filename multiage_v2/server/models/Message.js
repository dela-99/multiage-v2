const mongoose = require("mongoose");

function normalizeMessageStatus(status, isRead) {
  const raw = String(status || "").trim().toLowerCase();

  if (raw === "read" || raw === "contacted" || raw === "closed") {
    return "read";
  }

  if (isRead === true) {
    return "read";
  }

  return "unread";
}

const messageSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      lowercase: true,
      trim:     true,
    },
    phone: {
      type:    String,
      default: "",
      trim:    true,
    },
    service: {
      type:    String,
      default: "",
    },
    kind: {
      type:    String,
      enum:    ["contact", "used-device-inquiry"],
      default: "contact",
    },
    deviceRequested: {
      type:    String,
      default: "",
      trim:    true,
    },
    source: {
      type:    String,
      default: "website",
      trim:    true,
    },
    status: {
      type:    String,
      enum:    ["unread", "read"],
      default: "unread",
    },
    message: {
      type:     String,
      required: [true, "Message is required"],
      trim:     true,
    },
    isRead: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.pre("validate", function normalizeStatus(next) {
  this.status = normalizeMessageStatus(this.status, this.isRead);
  this.isRead = this.status === "read";
  next();
});

module.exports = mongoose.model("Message", messageSchema);
