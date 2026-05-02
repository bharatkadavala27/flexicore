const mongoose = require("mongoose");
const s = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: String,
  subject: String,
  country: String,
  type: { type: String, enum: ["contact", "product", "product_enquiry"], default: "contact" },
  productName: String,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Enquiry", s);
