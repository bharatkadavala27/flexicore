const mongoose = require("mongoose");
const s = new mongoose.Schema({
  title: { type: String, required: true },
  department: String, location: String,
  description: String,
  closingDate: Date,
  isActive: { type: Boolean, default: true },
  applications: [{ name: String, email: String, phone: String, resumeUrl: String, appliedAt: { type: Date, default: Date.now } }],
}, { timestamps: true });
module.exports = mongoose.model("Career", s);
