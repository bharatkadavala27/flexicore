const mongoose = require("mongoose");
const s = new mongoose.Schema({
  whatsappNumber: String,
  whatsappMessage: String,
  socialLinks: {
    facebook: String, instagram: String, linkedin: String, youtube: String, twitter: String,
  },
  footerText: String,
  privacyPolicyContent: String,
  deliveryPageContent: String,
  cookieConsentText: String,
}, { timestamps: true });
module.exports = mongoose.model("Settings", s);
