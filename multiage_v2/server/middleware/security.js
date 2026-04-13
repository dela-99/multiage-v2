const rateBuckets = new Map();

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

const rateLimiter = ({ windowMs = 15 * 60 * 1000, max = 200 } = {}) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const current = rateBuckets.get(key);

    if (!current || now > current.expiresAt) {
      rateBuckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    current.count += 1;
    return next();
  };
};

module.exports = { securityHeaders, rateLimiter };
