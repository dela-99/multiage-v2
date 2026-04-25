const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const { sendWelcomeNotification } = require("../services/emailService");
const { verifyFirebaseIdToken } = require("../services/firebaseAdmin");

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
  mustChangePassword: user.mustChangePassword,
  firebaseId: user.firebaseId || "",
  profilePicture: user.profilePicture || "",
  token: generateToken(user._id),
});

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

    if (newPassword === "Multiage@2026") {
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

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, googleLogin, getMe, getAllUsers, deleteUser, changePassword };
