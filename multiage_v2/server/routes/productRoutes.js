const express = require("express");
const router  = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

// Public
router.get("/",    getProducts);
router.get("/:id", getProduct);

// Admin
router.post("/",        protect, adminOnly, createProduct);
router.put("/:id",      protect, adminOnly, updateProduct);
router.delete("/:id",   protect, adminOnly, deleteProduct);

module.exports = router;
