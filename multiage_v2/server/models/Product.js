/**
 * @deprecated E-commerce product model — store removed from application.
 * MongoDB collection preserved for recovery.
 */
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Product name is required"],
      trim:     true,
    },
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [0, "Price cannot be negative"],
    },
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum:     ["Phones", "Laptops", "Tablets", "Accessories", "Watches", "Audio", "Other"],
    },
    type: {
      type:     String,
      enum:     ["new", "used"],
      default:  "new",
      required: [true, "Product type is required"],
    },
    condition: {
      type:    String,
      default: "",
      trim:    true,
      validate: {
        validator(value) {
          if (this.type !== "used") {
            return true;
          }

          return Boolean(String(value || "").trim());
        },
        message: "Condition is required for used products",
      },
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 4,
        message: "Provide 1 to 4 images per product",
      },
      default: [],
    },
    imagePublicId: {
      type:    String,
      default: "",
    },
    description: {
      type:    String,
      default: "",
      trim:    true,
    },
    stock: {
      type:    Number,
      default: 0,
      min:     [0, "Stock cannot be negative"],
    },
    brand: {
      type:    String,
      default: "",
      trim:    true,
    },
    specs: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
    },
    isFeatured: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.type !== "used") {
    this.condition = "";
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
