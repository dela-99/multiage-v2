const Product = require("../models/Product");
const { uploadToCloudinary } = require("../utils/cloudinary");

const normalizeProductPayload = async (payload = {}) => {
  const nextPayload = { ...payload };

  if (typeof nextPayload.type === "string") {
    nextPayload.type = nextPayload.type.toLowerCase();
  }

  if (nextPayload.image && typeof nextPayload.image === "string") {
    const isCloudinaryHosted = nextPayload.image.includes("res.cloudinary.com");
    if (!isCloudinaryHosted) {
      const uploaded = await uploadToCloudinary(nextPayload.image);
      nextPayload.image = uploaded.url || nextPayload.image;
      nextPayload.imagePublicId = uploaded.publicId || "";
    }
  }

  if (nextPayload.type !== "used") {
    nextPayload.condition = "";
  }

  if (nextPayload.price !== undefined) {
    nextPayload.price = Number(nextPayload.price);
  }

  if (nextPayload.stock !== undefined) {
    nextPayload.stock = Number(nextPayload.stock);
  }

  if (nextPayload.isFeatured !== undefined) {
    nextPayload.isFeatured = nextPayload.isFeatured === true || nextPayload.isFeatured === "true";
  }

  return nextPayload;
};

// ── @route  GET /api/products ─────────────────────────────────────
// ── @access Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      featured,
      type,
      page = 1,
      limit = 12,
    } = req.query;
    const filter = {};
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);

    if (category)  filter.category   = category;
    if (featured)  filter.isFeatured = true;
    if (type)      filter.type       = String(type).toLowerCase();
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { brand:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort("-createdAt")
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({
      items: products,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/products/:id ────────────────────────────────
// ── @access Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/products ───────────────────────────────────
// ── @access Admin
const createProduct = async (req, res, next) => {
  try {
    const payload = await normalizeProductPayload(req.body);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/products/:id ────────────────────────────────
// ── @access Admin
const updateProduct = async (req, res, next) => {
  try {
    const payload = await normalizeProductPayload(req.body);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ── @route  DELETE /api/products/:id ─────────────────────────────
// ── @access Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
