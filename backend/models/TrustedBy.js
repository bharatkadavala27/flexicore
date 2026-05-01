const mongoose = require("mongoose");
const s = new mongoose.Schema({
  name: String,
  logo: { url: String, publicId: String },
  link: String,
  type: { type: String, enum: ["client", "press"], default: "client" },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model("TrustedBy", s);
