const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const ADMIN_ROLE_VALUES = [
  "CEO",
  "CYBER_IT",
  "FINANCE",
  "ADMINISTRATOR",
  "SECRETARY",
  "GRAPHICS",
];

const ADMIN_ROLES = ["admin", "ceo", "administrator", "finance", "cyber_it", "secretary", "graphics"];

const IS_ADMIN_ROLE = (role, adminRole) => {
  return ADMIN_ROLES.includes(String(role || "").toLowerCase()) || ADMIN_ROLE_VALUES.includes(String(adminRole || "").toUpperCase());
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: function () {
        return !this.firebaseId;
      },
      minlength: [6, "Password must be at least 6 characters"],
      select:   false, // never return password in queries by default
    },
    role: {
      type:    String,
      enum:    ["user", "admin", "ceo", "administrator", "finance", "graphics", "cyber_it", "secretary"],
      lowercase: true,
      trim:    true,
      default: "user",
    },
    adminRole: {
      type: String,
      enum: ADMIN_ROLE_VALUES,
      trim: true,
    },
    mustChangePassword: {
      type:    Boolean,
      default: false,
    },
    firebaseId: {
      type:    String,
      default: "",
      trim:    true,
      index:   true,
    },
    profilePicture: {
      type:    String,
      default: "",
      trim:    true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Virtual for Admin check
userSchema.virtual("isAdmin").get(function() {
  return IS_ADMIN_ROLE(this.role, this.adminRole);
});

// Validate adminRole is only set for admin users
userSchema.pre("save", function (next) {
  // Promotion Logic: If user has an adminRole but primary role is 'user', promote them.
  const r = String(this.role || "user").toLowerCase();
  const ar = String(this.adminRole || "").toUpperCase();
  const hasAdminRole = Boolean(ar && ADMIN_ROLE_VALUES.includes(ar));
  
  if (hasAdminRole && !ADMIN_ROLES.includes(r)) {
    this.role = String(this.adminRole).toLowerCase();
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("validate", function (next) {
  if (this.role) {
    this.role = String(this.role).toLowerCase();
    const r = this.role;
    if (r === "graphics" || r === "media" || r === "graphics_media") {
      this.role = "graphics";
    }
  }

  if (this.adminRole) {
    const normalizedAdminRole = String(this.adminRole).trim().toUpperCase().replace(/\s*\/\s*/g, "_");
    const nr = normalizedAdminRole;
    this.adminRole = (nr === "GRAPHICS" || nr === "MEDIA" || nr === "GRAPHICS_MEDIA") ? "GRAPHICS" : nr;
  }

  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
