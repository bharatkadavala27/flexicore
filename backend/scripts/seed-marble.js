const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');

const newMarbleProducts = [
  { slug: "white-fantacy", name: "White Fantacy", sku: "FC-401", description: "Elegant white surface with subtle fantasy patterns.", image: "/products/marble/fc-401.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Vanity", "Feature Wall"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "stonewood", name: "Stonewood", sku: "FC-402", description: "Warm stone surface with wood-like grain textures.", image: "/products/marble/fc-402.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Furniture"], features: ["Non-porous", "Hygienic", "Seamless joints"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "black-fantasy", name: "Black Fantasy", sku: "FC-403", description: "Deep black with mesmerizing fantasy veining.", image: "/products/marble/fc-403.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar Top", "Reception", "Feature Wall"], features: ["Non-porous", "Stain resistant", "Anti-bacterial"], industries: ["commercial", "hospitality", "corporate"] },
  { slug: "brown-fantacy", name: "Brown Fantacy", sku: "FC-404", description: "Rich brown base with elegant fantasy patterns.", image: "/products/marble/fc-404.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Vanity", "Retail"], features: ["Warm tone", "Hygienic", "Thermoformable"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "pietra-grey", name: "Pietra Grey", sku: "FC-405", description: "Classic grey marble with white linear veining.", image: "/products/marble/fc-405.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Flooring"], features: ["Non-porous", "Seamless", "Stain resistant"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "carrara-white-marble", name: "Carrara White Marble", sku: "FC-406", description: "Iconic white marble look with soft grey veining.", image: "/products/marble/fc-406.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Vanity", "Kitchen", "Lobby"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "hospitality", "healthcare"] },
  { slug: "moonstone-flow", name: "Moonstone Flow", sku: "FC-407", description: "Ethereal moonstone surface with flowing patterns.", image: "/products/marble/fc-407.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Feature Wall"], features: ["Non-porous", "Thermoformable", "Seamless"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "graphite-vein", name: "Graphite Vein", sku: "FC-408", description: "Crisp surface with sharp graphite-colored veins.", image: "/products/marble/fc-408.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Reception Desk", "Retail"], features: ["Non-porous", "Stain resistant", "Repairable"], industries: ["commercial", "corporate", "hospitality"] },
  { slug: "mist-aura-marble", name: "Mist Aura Marble", sku: "FC-409", description: "Soft mist patterns with a luxurious marble aura.", image: "/products/marble/fc-409.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Hospitality"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "hospitality", "healthcare"] },
  { slug: "blush-marble-white", name: "Blush Marble White", sku: "FC-410", description: "White marble base with subtle blush undertones.", image: "/products/marble/fc-410.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Vanity", "Feature Wall", "Residential"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["residential", "hospitality", "commercial"] },
];

async function seedMarble() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Marble category
    let marbleCat = await Category.findOne({ slug: 'marble' });
    if (!marbleCat) {
      marbleCat = await Category.create({ name: 'Marble', slug: 'marble' });
      console.log('+ Created Marble category');
    }

    // Remove old Marble products
    const deleted = await Product.deleteMany({ category: marbleCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Marble products`);

    // Insert new products
    for (const p of newMarbleProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: marbleCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Marble',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newMarbleProducts.length} Marble products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedMarble();
