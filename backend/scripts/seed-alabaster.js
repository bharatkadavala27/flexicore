const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');

const newAlabasterProducts = [
  { slug: "ivory-mist-strands", name: "Ivory Mist Strands", sku: "FC-701", description: "Elegant ivory surface with soft misty strand patterns.", image: "/products/alabaster/fc-701.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Feature Wall", "Vanity"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "honey-marble-lines", name: "Honey Marble Lines", sku: "FC-702", description: "Warm honey tones with flowing marble line patterns.", image: "/products/alabaster/fc-702.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Lobby"], features: ["Non-porous", "Seamless joints", "Hygienic"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "royal-pearl-drift", name: "Royal Pearl Drift", sku: "FC-703", description: "Pearlescent surface with royal drift patterns.", image: "/products/alabaster/fc-703.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Vanity", "Feature Wall", "Reception"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "desert-sand-stripes", name: "Desert Sand Stripes", sku: "FC-704", description: "Sandy tones with natural stripe formations.", image: "/products/alabaster/fc-704.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Hospitality", "Retail"], features: ["Warm tone", "Hygienic", "Thermoformable"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "golden-ember-mix", name: "Golden Ember Mix", sku: "FC-705", description: "Rich golden tones with ember-like mixed patterns.", image: "/products/alabaster/fc-705.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Bar Top", "Reception"], features: ["Non-porous", "Seamless", "Thermoformable"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "caramel-smoke-lines", name: "Caramel Smoke Lines", sku: "FC-706", description: "Caramel base with smoky line detailing.", image: "/products/alabaster/fc-706.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Commercial"], features: ["Non-porous", "Stain resistant", "Repairable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "fresh-moss-lines", name: "Fresh Moss Lines", sku: "FC-707", description: "Fresh green moss-inspired line patterns.", image: "/products/alabaster/fc-707.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Hospitality", "Retail"], features: ["Non-porous", "Hygienic", "Thermoformable"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "natural-grain-marble", name: "Natural Grain Marble", sku: "FC-708", description: "Natural grain patterns with marble aesthetics.", image: "/products/alabaster/fc-708.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Vanity", "Flooring"], features: ["Non-porous", "Seamless joints", "Stain resistant"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "golden-aura-swirl", name: "Golden Aura Swirl", sku: "FC-709", description: "Swirling golden aura patterns on a warm base.", image: "/products/alabaster/fc-709.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Reception", "Bar"], features: ["Non-porous", "Thermoformable", "Seamless"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "inferno-marble", name: "Inferno Marble", sku: "FC-710", description: "Bold inferno-inspired marble patterns.", image: "/products/alabaster/fc-710.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Bar Top", "Reception"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "rustwood-grain", name: "Rustwood Grain", sku: "FC-711", description: "Rustic wood grain inspired surface.", image: "/products/alabaster/fc-711.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Furniture", "Commercial"], features: ["Non-porous", "Hygienic", "Repairable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "cream-mist-marble", name: "Cream Mist Marble", sku: "FC-712", description: "Creamy mist with soft marble veining.", image: "/products/alabaster/fc-712.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bathroom", "Kitchen", "Healthcare"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "healthcare", "hospitality"] },
  { slug: "silver-rose-drift", name: "Silver Rose Drift", sku: "FC-713", description: "Silver and rose tones with drift patterns.", image: "/products/alabaster/fc-713.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Retail", "Hospitality", "Vanity"], features: ["Non-porous", "Thermoformable", "Seamless"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "sunny-mist-flow", name: "Sunny Mist Flow", sku: "FC-714", description: "Sunny tones with flowing mist patterns.", image: "/products/alabaster/fc-714.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Hospitality", "Retail"], features: ["Non-porous", "Stain resistant", "Hygienic"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "black-mist-cascade", name: "Black Mist Cascade", sku: "FC-715", description: "Deep black with cascading mist patterns.", image: "/products/alabaster/fc-715.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Bar", "Feature Wall"], features: ["Non-porous", "Stain resistant", "Anti-bacterial"], industries: ["commercial", "corporate", "hospitality"] },
  { slug: "marine-mist-texture", name: "Marine Mist Texture", sku: "FC-716", description: "Marine-inspired mist with textured patterns.", image: "/products/alabaster/fc-716.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Hospitality"], features: ["Non-porous", "Waterproof", "Hygienic"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "marine-mist-texture-ii", name: "Marine Mist Texture II", sku: "FC-717", description: "Enhanced marine mist with refined texture patterns.", image: "/products/alabaster/fc-717.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Pool", "Bathroom"], features: ["Non-porous", "Waterproof", "Seamless"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "amber-net-texture", name: "Amber Net Texture", sku: "FC-718", description: "Amber tones with delicate net-like texture.", image: "/products/alabaster/fc-718.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Feature Wall", "Retail"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "sunlit-pearl-drift", name: "Sunlit Pearl Drift", sku: "FC-719", description: "Sunlit pearl tones with gentle drift patterns.", image: "/products/alabaster/fc-719.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Vanity", "Bathroom", "Hospitality"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "hospitality", "healthcare"] },
  { slug: "desert-woodgrain", name: "Desert Woodgrain", sku: "FC-720", description: "Desert-inspired wood grain surface.", image: "/products/alabaster/fc-720.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Furniture", "Commercial"], features: ["Warm tone", "Non-porous", "Repairable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "cream-breeze-flow", name: "Cream Breeze Flow", sku: "FC-721", description: "Creamy tones with gentle breeze-like flow patterns.", image: "/products/alabaster/fc-721.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Healthcare"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "healthcare", "hospitality"] },
  { slug: "lime-wave-texture", name: "Lime Wave Texture", sku: "FC-722", description: "Fresh lime tones with wave-like texture.", image: "/products/alabaster/fc-722.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Retail", "Spa", "Feature Wall"], features: ["Non-porous", "Thermoformable", "Stain resistant"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "ocean-softwave", name: "Ocean Softwave", sku: "FC-723", description: "Soft ocean-inspired wave patterns.", image: "/products/alabaster/fc-723.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Hospitality"], features: ["Non-porous", "Waterproof", "Hygienic"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "citrine-thunder-flow", name: "Citrine Thunder Flow", sku: "FC-724", description: "Citrine tones with dramatic thunder flow patterns.", image: "/products/alabaster/fc-724.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Reception", "Bar Top"], features: ["Non-porous", "Stain resistant", "Thermoformable"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "golden-storm-fusion", name: "Golden Storm Fusion", sku: "FC-725", description: "Golden tones with stormy fusion patterns.", image: "/products/alabaster/fc-725.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Bar", "Feature Wall"], features: ["Non-porous", "Seamless", "Thermoformable"], industries: ["hospitality", "commercial", "corporate"] },
  { slug: "graphite-cascade", name: "Graphite Cascade", sku: "FC-726", description: "Graphite tones with cascading patterns.", image: "/products/alabaster/fc-726.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Bar Top", "Feature Wall"], features: ["Non-porous", "Anti-bacterial", "Stain resistant"], industries: ["commercial", "corporate", "hospitality"] },
  { slug: "rustic-timber-stripes", name: "Rustic Timber Stripes", sku: "FC-727", description: "Rustic timber-inspired stripe patterns.", image: "/products/alabaster/fc-727.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Furniture", "Commercial"], features: ["Non-porous", "Hygienic", "Repairable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "bronze-forest-veins", name: "Bronze Forest Veins", sku: "FC-728", description: "Bronze tones with forest-inspired vein patterns.", image: "/products/alabaster/fc-728.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Feature Wall", "Retail"], features: ["Non-porous", "Thermoformable", "Seamless"], industries: ["residential", "commercial", "hospitality"] },
];

async function seedAlabaster() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Alabaster category
    let alabasterCat = await Category.findOne({ slug: 'alabaster' });
    if (!alabasterCat) {
      alabasterCat = await Category.create({ name: 'Alabaster', slug: 'alabaster' });
      console.log('+ Created Alabaster category');
    }

    // Remove old Alabaster products
    const deleted = await Product.deleteMany({ category: alabasterCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Alabaster products`);

    // Insert new products
    for (const p of newAlabasterProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: alabasterCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Alabaster',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newAlabasterProducts.length} Alabaster products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedAlabaster();
