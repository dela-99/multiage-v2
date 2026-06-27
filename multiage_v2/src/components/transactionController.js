const Transaction = require("../models/Transaction");

// @desc    Create a new transaction (manual entry)
// @route   POST /api/transactions
// @access  Private (Finance, CEO)
const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions with filtering
// @route   GET /api/transactions
// @access  Private (Finance, CEO)
const getTransactions = async (req, res, next) => {
  try {
    const { type, category, paymentMethod } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const transactions = await Transaction.find(query).populate("client", "name").populate("project", "requestedService").sort({ transactionDate: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private (Finance, CEO)
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private (Finance, CEO)
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private (Finance, CEO)
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };