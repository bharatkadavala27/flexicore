const mongoose = require("mongoose");
const s = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  pinCode: String, area: String, city: String, state: String,
  country: { type: String, default: "India" },
  territory: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isVisibleOnMap: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Distributor", s);
