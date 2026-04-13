const mongoose = require("mongoose");

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
      enum:    ["new", "contacted", "closed"],
      default: "new",
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

module.exports = mongoose.model("Message", messageSchema);
