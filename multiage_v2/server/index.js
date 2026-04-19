require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { helmetMiddleware, apiLimiter } = require("./middleware/security");

// ── Route imports ─────────────────────────────────────────────────
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { seedProductCatalog } = require("./controllers/productController");
const { protect, adminOnly } = require("./middleware/auth");

// ── Connect to database ───────────────────────────────────────────
connectDB();

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: JWT_SECRET is required in production.");
    process.exit(1);
  }
  console.warn("⚠️  JWT_SECRET is not set. Login and protected routes will fail until it is configured.");
}

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ── Core middleware ───────────────────────────────────────────────
app.use(helmetMiddleware);
app.use("/api", apiLimiter);
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf.toString("utf8");
  },
}));
app.use(express.urlencoded({ extended: false }));

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:  "ok",
    message: "Multiage Technologies API is running",
    env:     process.env.NODE_ENV,
  });
});

// ── API routes ────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payment",  paymentRoutes);

// Legacy / docs alias — identical to POST /api/products/seed
app.post("/api/seed-products", protect, adminOnly, seedProductCatalog);

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler (must be last) ───────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
});
