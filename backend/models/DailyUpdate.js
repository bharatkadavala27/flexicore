const mongoose = require("mongoose");
const s = new mongoose.Schema({
  text: { type: String, required: true },
  link: String,
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model("DailyUpdate", s);
