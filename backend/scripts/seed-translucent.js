const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');

const newTranslucentProducts = [
  { slug: "cloud-white-translucent", name: "Cloud White", sku: "FC-201", description: "Soft cloud white with elegant translucency.", image: "/products/translucent/fc-201.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Backlit Wall", "Vanity", "Reception Desk"], features: ["Translucent", "Non-porous", "Seamless joints"], industries: ["hospitality", "residential", "corporate"] },
  { slug: "rose-pink", name: "Rose Pink", sku: "FC-202", description: "Gentle rose pink with a glowing translucent finish.", image: "/products/translucent/fc-202.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Spa", "Retail"], features: ["Translucent", "Stain resistant", "Thermoformable"], industries: ["hospitality", "residential", "commercial"] },
  { slug: "mint-green", name: "Mint Green", sku: "FC-203", description: "Fresh mint green with light-transmitting properties.", image: "/products/translucent/fc-203.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Bar", "Healthcare"], features: ["Translucent", "Hygienic", "Easy to clean"], industries: ["commercial", "healthcare", "hospitality"] },
  { slug: "sky-blue", name: "Sky Blue", sku: "FC-204", description: "Serene sky blue with a soft translucent glow.", image: "/products/translucent/fc-204.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Pool", "Spa", "Bathroom"], features: ["Translucent", "Waterproof", "Seamless"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "orange-translucent", name: "Orange", sku: "FC-205", description: "Vibrant orange with high-impact translucency.", image: "/products/translucent/fc-205.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar Top", "Feature Wall", "Retail"], features: ["Translucent", "Stain resistant", "Thermoformable"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "yellow-translucent", name: "Yellow", sku: "FC-206", description: "Bright yellow with luminous light transmission.", image: "/products/translucent/fc-206.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Display", "Feature Wall"], features: ["Translucent", "Non-porous", "Hygienic"], industries: ["commercial", "hospitality", "retail"] },
  { slug: "silver-fog", name: "Silver Fog", sku: "FC-207", description: "Sophisticated silver fog with a translucent depth.", image: "/products/translucent/fc-207.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office", "Lobby", "Furniture"], features: ["Translucent", "Repairable", "Seamless joints"], industries: ["corporate", "commercial", "hospitality"] },
  { slug: "dewy-green", name: "Dewy Green", sku: "FC-208", description: "Natural dewy green with a soft glowing effect.", image: "/products/translucent/fc-208.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Healthcare"], features: ["Translucent", "Anti-bacterial", "Non-porous"], industries: ["healthcare", "hospitality", "residential"] },
  { slug: "royal-raspberry", name: "Royal Raspberry", sku: "FC-209", description: "Rich royal raspberry with a deep translucent glow.", image: "/products/translucent/fc-209.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar", "Feature Wall", "Furniture"], features: ["Translucent", "Stain resistant", "Seamless"], industries: ["hospitality", "commercial", "residential"] },
];

async function seedTranslucent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Translucent category
    let translucentCat = await Category.findOne({ slug: 'translucent' });
    if (!translucentCat) {
      translucentCat = await Category.create({ name: 'Translucent', slug: 'translucent' });
      console.log('+ Created Translucent category');
    }

    // Remove old Translucent products
    const deleted = await Product.deleteMany({ category: translucentCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Translucent products`);

    // Insert new products
    for (const p of newTranslucentProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: translucentCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Translucent',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newTranslucentProducts.length} Translucent products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedTranslucent();
