const mongoose = require("mongoose");
const s = new mongoose.Schema({
  headline: { type: String, required: true },
  date: Date,
  articleUrl: String,
  mediaLogo: { url: String, publicId: String },
}, { timestamps: true });
module.exports = mongoose.model("Press", s);
