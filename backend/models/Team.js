const mongoose = require("mongoose");
const s = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: String,
  photo: { url: String, publicId: String },
  linkedinUrl: String,
  displayOrder: { type: Number, default: 0 },
  isFounder: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Team", s);
