const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      "Product",
    required: true,
  },
  name:     { type: String,  required: true },
  price:    { type: Number,  required: true },
  quantity: { type: Number,  required: true, min: 1 },
  image:    { type: String,  default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    items:      [orderItemSchema],
    totalPrice: {
      type:     Number,
      required: true,
      min:      0,
    },
    status: {
      type:    String,
      enum:    ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: String,
      phone:    String,
      address:  String,
      city:     String,
      region:   String,
    },
    isPaid:   { type: Boolean, default: false },
    paidAt:   { type: Date },
    paymentGateway: {
      type:    String,
      default: "",
      trim:    true,
    },
    paymentReference: {
      type:    String,
      default: "",
      trim:    true,
      index:   true,
    },
    paymentStatus: {
      type:    String,
      default: "pending",
      trim:    true,
    },
    paymentChannel: {
      type:    String,
      default: "",
      trim:    true,
    },
    note:     { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
