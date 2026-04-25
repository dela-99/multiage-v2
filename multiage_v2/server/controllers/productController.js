const mongoose = require("mongoose");
const Product = require("../models/Product");
const { uploadToCloudinary } = require("../utils/cloudinary");
const seedProducts = require("../data/seedProducts");

let catalogBootstrapPromise = null;

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

  if (Array.isArray(nextPayload.images)) {
    const uploadedImages = [];

    for (const image of nextPayload.images) {
      if (!image || typeof image !== "string") {
        continue;
      }

      if (image.includes("res.cloudinary.com")) {
        uploadedImages.push(image);
        continue;
      }

      const uploaded = await uploadToCloudinary(image);
      uploadedImages.push(uploaded.url || image);
      if (!nextPayload.imagePublicId && uploaded.publicId) {
        nextPayload.imagePublicId = uploaded.publicId;
      }
    }

    nextPayload.images = uploadedImages;
  }

  if ((!Array.isArray(nextPayload.images) || nextPayload.images.length === 0) && nextPayload.image) {
    nextPayload.images = [nextPayload.image];
  }

  if (!nextPayload.image && Array.isArray(nextPayload.images) && nextPayload.images.length > 0) {
    nextPayload.image = nextPayload.images[0];
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

  if (nextPayload.specs && typeof nextPayload.specs === "string") {
    try {
      nextPayload.specs = JSON.parse(nextPayload.specs);
    } catch {
      nextPayload.specs = {};
    }
  }

  return nextPayload;
};

const ensureCatalogAvailable = async () => {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    return;
  }

  if (!catalogBootstrapPromise) {
    catalogBootstrapPromise = Product.insertMany(seedProducts, { ordered: false })
      .catch(async (error) => {
        const countAfterAttempt = await Product.countDocuments();
        if (countAfterAttempt > 0) {
          return;
        }
        throw error;
      })
      .finally(() => {
        catalogBootstrapPromise = null;
      });
  }

  await catalogBootstrapPromise;
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── @route  GET /api/products ─────────────────────────────────────
// ── @access Public
const getProducts = async (req, res, next) => {
  try {
    await ensureCatalogAvailable();

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
    const safeSearch = search ? escapeRegex(search) : "";

    if (category)  filter.category   = category;
    if (featured)  filter.isFeatured = true;
    if (type)      filter.type       = String(type).toLowerCase();
    if (search) {
      filter.$or = [
        { name:        { $regex: safeSearch, $options: "i" } },
        { brand:       { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
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
    await ensureCatalogAvailable();

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/products/seed ───────────────────────────────
// ── @access Admin
const seedProductCatalog = async (req, res, next) => {
  try {
    const replace = req.query.replace === "true" || req.body?.replace === true;

    if (replace) {
      await Product.deleteMany({});
    }

    const existingCount = await Product.countDocuments();
    if (!replace && existingCount > 0) {
      return res.status(409).json({
        message: "Products already exist. Use ?replace=true to overwrite current catalog.",
        existingCount,
      });
    }

    // Optional: Normalize each product from the seed file to ensure 
    // consistency with manually created products.
    const normalizedSeeds = await Promise.all(
      seedProducts.map(p => normalizeProductPayload(p))
    );

    const inserted = await Product.insertMany(normalizedSeeds, { ordered: false });
    return res.status(201).json({
      message: "Product catalog seeded successfully",
      insertedCount: inserted.length,
      replaced: replace,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProductCatalog,
};
