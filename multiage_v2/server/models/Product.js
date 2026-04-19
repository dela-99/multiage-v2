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
    image: {
      type:    String,
      default: "",
    },
    images: {
      type:    [String],
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

  if ((!this.images || this.images.length === 0) && this.image) {
    this.images = [this.image];
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
