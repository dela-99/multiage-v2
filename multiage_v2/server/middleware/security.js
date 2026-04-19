const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// JSON API — CSP disabled (for HTML). HSTS only in production (set NODE_ENV behind TLS).
const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts:
    process.env.NODE_ENV === "production"
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  permissionsPolicy: {
    features: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
  skip: (req) => req.method === "GET" && req.originalUrl.split("?")[0] === "/api/health",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please wait and try again." },
});

module.exports = {
  helmetMiddleware,
  apiLimiter,
  authLimiter,
};
