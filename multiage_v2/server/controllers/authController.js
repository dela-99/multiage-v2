const crypto = require("crypto");
const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const {
  sendWelcomeNotification,
  sendPasswordResetEmail,
  sendPasswordChangedAlert,
} = require("../services/emailService");
const { verifyFirebaseIdToken } = require("../services/firebaseAdmin");

const DEFAULT_TEMP_PASSWORD = process.env.DEFAULT_TEMP_PASSWORD;
const RESET_TOKEN_TTL_MINUTES = 15;

// ── Generate JWT ──────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isAdmin: user.isAdmin,
  mustChangePassword: user.mustChangePassword,
  firebaseId: user.firebaseId || "",
  profilePicture: user.profilePicture || "",
  token: generateToken(user._id),
});

const buildResetLink = (token) => {
  const base = (process.env.CLIENT_URL || "https://multiage-v2-updated-1.vercel.app").replace(/\/+$/, "");
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
};

// ── @route  POST /api/auth/register ──────────────────────────────
// ── @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    sendWelcomeNotification(user).catch((error) => {
      console.error("Welcome email failed:", error.message);
    });

    res.status(201).json(buildAuthPayload(user));
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/login ──────────────────────────────────
// ── @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`[Login Success] UserID: ${user._id}, Role: ${user.role}, IsAdmin: ${user.isAdmin}`);

    // If this is an admin-specific login or needs validation
    if (req.originalUrl.includes("/admin") && !user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Not an authorized admin account" });
    }

    res.json(buildAuthPayload(user));
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/google ─────────────────────────────────
// ── @access Public
const googleLogin = async (req, res, next) => {
  try {
    const { name, email, photo, uid, idToken } = req.body;

    if (!name || !email || !uid || !idToken) {
      return res.status(400).json({ message: "Please provide name, email, uid, and idToken" });
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    if (decoded.uid !== uid || decoded.email !== email) {
      return res.status(401).json({ message: "Firebase identity verification failed" });
    }

    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (!user) {
      user = await User.create({
        name,
        email,
        firebaseId: uid,
        profilePicture: photo || "",
      });
    } else {
      let changed = false;

      if (!user.firebaseId) {
        user.firebaseId = uid;
        changed = true;
      }

      if (!user.profilePicture && photo) {
        user.profilePicture = photo;
        changed = true;
      }

      if (!user.name && name) {
        user.name = name;
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    if (isNewUser) {
      sendWelcomeNotification(user).catch((error) => {
        console.error("Welcome email failed:", error.message);
      });
    }

    res.json(buildAuthPayload(user));
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/auth/me ──────────────────────────────────────
// ── @access Private
const getMe = async (req, res) => {
  res.json({
    _id:       req.user._id,
    name:      req.user.name,
    email:     req.user.email,
    role:      req.user.role,
    firebaseId: req.user.firebaseId || "",
    profilePicture: req.user.profilePicture || "",
    createdAt: req.user.createdAt,
  });
};

// ── @route  GET /api/auth/users ───────────────────────────────────
// ── @access Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ── @route  DELETE /api/auth/users/:id ───────────────────────────
// ── @access Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin account" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/auth/password ───────────────────────────────
// ── @access Private (any authenticated user or admin)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide currentPassword and newPassword" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    if (DEFAULT_TEMP_PASSWORD && newPassword === DEFAULT_TEMP_PASSWORD) {
      return res.status(400).json({ message: "You cannot reuse the default temporary password" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ message: "New password must be different from your current password" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    sendPasswordChangedAlert(user).catch((error) => {
      console.error("Password changed email failed:", error.message);
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/forgot-password ───────────────────────
// ── @access Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    try {
      await sendPasswordResetEmail({
        user,
        resetLink: buildResetLink(rawToken),
        expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
      });
    } catch (error) {
      user.resetPasswordToken = "";
      user.resetPasswordExpires = undefined;
      await user.save();
      throw error;
    }

    res.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/reset-password ────────────────────────
// ── @access Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Please provide token and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired" });
    }

    user.password = password;
    user.mustChangePassword = false;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;
    await user.save();

    sendPasswordChangedAlert(user).catch((error) => {
      console.error("Password changed email failed:", error.message);
    });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  getAllUsers,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
