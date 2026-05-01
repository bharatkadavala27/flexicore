const mongoose = require("mongoose");
const s = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true },
  title: String,
  metaDescription: String,
  keywords: [String],
  canonicalUrl: String,
  robotsTxt: String,
}, { timestamps: true });
module.exports = mongoose.model("Seo", s);
