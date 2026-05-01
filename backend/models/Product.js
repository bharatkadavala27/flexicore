const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  sku: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [String],
  description: { type: String },
  metaDescription: { type: String },
  images: [{ url: String, publicId: String }],
  gallery: [{ url: String, publicId: String }],
  videoUrl: { type: String },
  priceRange: { type: String },
  isVisible: { type: Boolean, default: true },
  surface: { type: String },
  finish: { type: String },
  thickness: { type: String },
  dimensions: { type: String },
  applications: [String],
  features: [String],
  industries: [String],
}, { timestamps: true });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Product", productSchema);
