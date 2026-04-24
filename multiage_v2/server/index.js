require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const path         = require("path");
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

// ── Validate required environment variables ───────────────────────
const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "PAYSTACK_SECRET_KEY",
];

const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  if (process.env.NODE_ENV === "production") {
    console.error(`FATAL: Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }
  console.warn(`⚠️  Missing environment variables: ${missingVars.join(", ")}. Some features will not work until these are configured.`);
}

// ── Connect to database ───────────────────────────────────────────
connectDB();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ── Core middleware ───────────────────────────────────────────────
app.use(helmetMiddleware);
app.use("/api", apiLimiter);
app.use(cors({
  origin:      process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf.toString("utf8");
  },
}));
app.use(express.urlencoded({ extended: false }));

// ── Serve static files from the frontend build ─────────────────────
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

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

// ── Root health route ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API running");
});

// ── SPA fallback route - serve index.html for client-side routing ──
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ── Global error handler (must be last) ───────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
});
