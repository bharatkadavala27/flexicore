const mongoose = require("mongoose");
const s = new mongoose.Schema({
  title: { type: String, required: true },
  issuingBody: String,
  date: Date,
  image: { url: String, publicId: String },
  enableDownload: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model("Certificate", s);
