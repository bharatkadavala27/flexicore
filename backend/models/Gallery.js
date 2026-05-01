const mongoose = require("mongoose");
const s = new mongoose.Schema({
  title: String,
  image: { url: String, publicId: String },
  category: { type: String, enum: ["factory", "installation", "event", "entry-to-exit"], default: "factory" },
  stepLabel: String,
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model("Gallery", s);
