const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Revenue", "Expense"],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String }, // e.g., 'Service Payment', 'Software License', 'Salary'
  paymentMethod: {
    type: String,
    enum: ["Online", "Offline", "Bank Transfer", "Cash"],
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue", "Cancelled"],
    default: "Paid",
    index: true,
  },
  transactionDate: { type: Date, default: Date.now },
  // Link to related entities
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // For invoices
  invoiceNumber: { type: String, sparse: true },
  dueDate: { type: Date },
}, { timestamps: true });

transactionSchema.index({ type: 1, category: 1 });
transactionSchema.index({ project: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);