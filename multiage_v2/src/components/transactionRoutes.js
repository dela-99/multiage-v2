const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect, authorize } = require("../middleware/authMiddleware");

const financeRoles = ["CEO", "FINANCE"];

router.route("/")
  .get(protect, authorize(...financeRoles), getTransactions)
  .post(protect, authorize(...financeRoles), createTransaction);

router.route("/:id")
  .get(protect, authorize(...financeRoles), getTransactionById)
  .put(protect, authorize(...financeRoles), updateTransaction)
  .delete(protect, authorize(...financeRoles), deleteTransaction);

module.exports = router;