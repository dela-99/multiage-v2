const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

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
      enum:    ["user", "admin", "ceo", "administrator", "finance", "media", "cyber_it", "graphics"],
      lowercase: true,
      default: "user",
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
