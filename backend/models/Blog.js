const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  featuredImage: { url: String, publicId: String },
  seoTitle: { type: String },
  metaDescription: { type: String },
  tags: [String],
  author: { type: String },
  publishDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
