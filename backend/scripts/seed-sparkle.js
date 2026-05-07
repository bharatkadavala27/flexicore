const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');

const newSparkleProducts = [
  { slug: "night-black", name: "Night Black", sku: "FC-501", description: "Deep night black with subtle shimmering sparkles.", image: "/products/sparkle/fc-501.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Bar Top", "Feature Wall"], features: ["Non-porous", "Light-reactive", "Stain resistant"], industries: ["commercial", "hospitality", "corporate"] },
  { slug: "sparkle-white", name: "Sparkle White", sku: "FC-502", description: "Crisp white with elegant sparkling accents.", image: "/products/sparkle/fc-502.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen Countertop", "Vanity", "Lobby"], features: ["Non-porous", "Hygienic", "Seamless joints"], industries: ["residential", "hospitality", "healthcare"] },
];

async function seedSparkle() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Sparkle category
    let sparkleCat = await Category.findOne({ slug: 'sparkle' });
    if (!sparkleCat) {
      sparkleCat = await Category.create({ name: 'Sparkle', slug: 'sparkle' });
      console.log('+ Created Sparkle category');
    }

    // Remove old Sparkle products
    const deleted = await Product.deleteMany({ category: sparkleCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Sparkle products`);

    // Insert new products
    for (const p of newSparkleProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: sparkleCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Sparkle',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newSparkleProducts.length} Sparkle products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedSparkle();
