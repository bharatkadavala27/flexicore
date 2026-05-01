require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const email = process.env.ADMIN_EMAIL || "admin@flexicore.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  
  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`✅ Admin already exists: ${email}`);
    process.exit(0);
  }
  
  await User.create({ name: "Flexicore Admin", email, password });
  console.log(`✅ Admin created: ${email} / ${password}`);
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
