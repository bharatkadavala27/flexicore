const mongoose = require("mongoose");
const s = new mongoose.Schema({
  name: { type: String, required: true },
  date: Date, endDate: Date,
  location: String, description: String,
  registrationLink: String,
  isUpcoming: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model("Expo", s);
