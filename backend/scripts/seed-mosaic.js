const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Category = require('../models/Category');
const Product = require('../models/Product');

const newMosaicProducts = [
  { slug: "pebblon-lvory", name: "Pebblon Lvory", sku: "FC-301", description: "Elegant ivory pebble-inspired mosaic pattern.", image: "/products/mosaic/fc-301.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen Countertop", "Bathroom Vanity", "Lobby"], features: ["Non-porous", "Durable", "Seamless"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "pebblon-tr-pista", name: "Pebblon TR. Pista", sku: "FC-302", description: "Soft pista green with translucent pebble accents.", image: "/products/mosaic/fc-302.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar Top", "Reception Desk", "Spa"], features: ["Translucent accents", "Non-porous", "Stain resistant"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "pebblon-tr-white", name: "Pebblon TR. White", sku: "FC-303", description: "Crisp white with translucent pebble patterns.", image: "/products/mosaic/fc-303.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Backlit Wall", "Kitchen Countertop", "Healthcare"], features: ["Translucent", "Hygienic", "Seamless"], industries: ["residential", "healthcare", "hospitality"] },
  { slug: "pebblon-tr-brown", name: "Pebblon TR. Brown", sku: "FC-304", description: "Warm brown with earthy translucent pebble textures.", image: "/products/mosaic/fc-304.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception Desk", "Restaurant Bar", "Office"], features: ["Translucent accents", "Durable", "Thermoformable"], industries: ["commercial", "hospitality", "corporate"] },
  { slug: "pebblon-grey", name: "Pebblon Grey", sku: "FC-305", description: "Modern grey with natural pebble-inspired depth.", image: "/products/mosaic/fc-305.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office Desk", "Retail Counter", "Hospitality"], features: ["Non-porous", "Impact resistant", "Seamless joints"], industries: ["corporate", "commercial", "hospitality"] },
  { slug: "pebblon-light-biscut", name: "Pebblon Light Biscut", sku: "FC-306", description: "Soft biscuit tone with subtle pebble detailing.", image: "/products/mosaic/fc-306.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Residential Kitchen", "Vanity", "Lobby"], features: ["Easy to clean", "Non-porous", "Seamless"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "mystery-white", name: "Mystery White", sku: "FC-307", description: "Enigmatic white with fine mosaic grain.", image: "/products/mosaic/fc-307.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Hospitality", "Healthcare", "Residential"], features: ["Hygienic", "Low maintenance", "Seamless"], industries: ["healthcare", "hospitality", "residential"] },
  { slug: "navajo-white", name: "Navajo White", sku: "FC-308", description: "Creamy Navajo white with a delicate mosaic texture.", image: "/products/mosaic/fc-308.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Living Space"], features: ["Stain resistant", "Non-porous", "Seamless joints"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "ice-mosaic", name: "Ice Mosaic", sku: "FC-309", description: "Cool ice-inspired mosaic pattern with light depth.", image: "/products/mosaic/fc-309.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar Top", "Countertop", "Feature Wall"], features: ["Light-reactive", "Non-porous", "Durable"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "latle-mosiac", name: "Latle Mosiac", sku: "FC-310", description: "Rich latte-inspired mosaic with warm tones.", image: "/products/mosaic/fc-310.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Cafe", "Kitchen", "Reception"], features: ["Non-porous", "Stain resistant", "Seamless"], industries: ["hospitality", "residential", "commercial"] },
  { slug: "iron-ore-mosaic", name: "Iron Ore Mosaic", sku: "FC-311", description: "Strong iron ore-inspired mosaic with industrial appeal.", image: "/products/mosaic/fc-311.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Corporate Office", "Industrial Loft", "Bar"], features: ["Durable", "Non-porous", "Impact resistant"], industries: ["corporate", "commercial", "hospitality"] },
  { slug: "misty-pebble-grey", name: "Misty Pebble Grey", sku: "FC-312", description: "Soft grey with misty pebble-inspired patterns.", image: "/products/mosaic/fc-312.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Wellness Center"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["hospitality", "healthcare", "residential"] },
  { slug: "aurora-flakes-white", name: "Aurora Flakes White", sku: "FC-313", description: "Luminous white with shimmering aurora flakes.", image: "/products/mosaic/fc-313.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Reception", "Luxury Kitchen"], features: ["Shimmering effect", "Non-porous", "Thermoformable"], industries: ["hospitality", "residential", "corporate"] },
  { slug: "black-galaxy-flake", name: "Black Galaxy Flake", sku: "FC-314", description: "Deep black with cosmic galaxy-inspired flakes.", image: "/products/mosaic/fc-314.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar", "Nightclub", "Feature Wall"], features: ["Light-reactive", "Durable", "Stain resistant"], industries: ["hospitality", "commercial", "entertainment"] },
  { slug: "soft-stone-sprinkle", name: "Soft Stone Sprinkle", sku: "FC-315", description: "Gentle stone-inspired sprinkle pattern.", image: "/products/mosaic/fc-315.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Vanity", "Office"], features: ["Non-porous", "Easy to maintain", "Seamless joints"], industries: ["residential", "corporate", "hospitality"] },
  { slug: "silver-spark-mist", name: "Silver Spark Mist", sku: "FC-316", description: "Cool mist with subtle silver sparkling accents.", image: "/products/mosaic/fc-316.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception Desk", "Bathroom", "Retail"], features: ["Light-reactive", "Non-porous", "Seamless"], industries: ["commercial", "hospitality", "residential"] },
  { slug: "fog-sprinkle", name: "Fog Sprinkle", sku: "FC-317", description: "Muted fog tone with fine sprinkle detailing.", image: "/products/mosaic/fc-317.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Modern Kitchen", "Office", "Commercial Space"], features: ["Durable", "Non-porous", "Stain resistant"], industries: ["residential", "corporate", "commercial"] },
  { slug: "arctic-mist", name: "Arctic Mist", sku: "FC-318", description: "Cool arctic mist with a delicate mosaic texture.", image: "/products/mosaic/fc-318.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bathroom", "Spa", "Lobby"], features: ["Non-porous", "Hygienic", "Seamless joints"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "moon-gold-pebble", name: "Moon Gold Pebble", sku: "FC-319", description: "Celestial gold and moon-inspired pebble pattern.", image: "/products/mosaic/fc-319.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Bar", "Luxury Suite"], features: ["Shimmering accents", "Non-porous", "Durable"], industries: ["hospitality", "residential", "commercial"] },
  { slug: "granite-mist", name: "Granite Mist", sku: "FC-320", description: "Granite-inspired mist with natural stone depth.", image: "/products/mosaic/fc-320.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Heavy-duty Countertop", "Reception", "Retail"], features: ["Impact resistant", "Non-porous", "Seamless"], industries: ["commercial", "corporate", "hospitality"] },
  { slug: "polar-pebble", name: "Polar Pebble", sku: "FC-321", description: "Bright polar white with contrasting pebble patterns.", image: "/products/mosaic/fc-321.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Bathroom", "Healthcare"], features: ["Hygienic", "Non-porous", "Stain resistant"], industries: ["residential", "healthcare", "hospitality"] },
  { slug: "crystal-white-mosaic", name: "Crystal White", sku: "FC-601", description: "Pure crystal white with fine mosaic grain.", image: "/products/mosaic/fc-601.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Healthcare", "Kitchen", "Vanity"], features: ["Hygienic", "Non-porous", "Seamless"], industries: ["healthcare", "residential", "hospitality"] },
  { slug: "moonlight-glitter", name: "Moonlight Glitter", sku: "FC-602", description: "Soft moonlight with shimmering glitter particles.", image: "/products/mosaic/fc-602.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Bar", "Luxury Retail"], features: ["Glitter effect", "Non-porous", "Thermoformable"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "driftstone-texture", name: "Driftstone Texture", sku: "FC-603", description: "Natural driftstone-inspired mosaic texture.", image: "/products/mosaic/fc-603.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Outdoor Space", "Lobby", "Wall Cladding"], features: ["Textured surface", "Durable", "Weather resistant"], industries: ["commercial", "hospitality", "residential"] },
  { slug: "silver-creek-pattern", name: "Silver Creek Pattern", sku: "FC-604", description: "Flowing silver creek mosaic pattern.", image: "/products/mosaic/fc-604.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception Desk", "Feature Wall", "Furniture"], features: ["Flowing pattern", "Non-porous", "Seamless joints"], industries: ["corporate", "commercial", "hospitality"] },
  { slug: "fogline-texture", name: "Fogline Texture", sku: "FC-605", description: "Misty fogline mosaic with linear texture.", image: "/products/mosaic/fc-605.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Wall Panel", "Office", "Hospitality"], features: ["Linear texture", "Non-porous", "Durable"], industries: ["corporate", "commercial", "hospitality"] },
  { slug: "natural-earthline", name: "Natural Earthline", sku: "FC-606", description: "Earthy natural line pattern in mosaic finish.", image: "/products/mosaic/fc-606.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Residential", "Public Space"], features: ["Natural aesthetic", "Non-porous", "Seamless"], industries: ["residential", "commercial", "hospitality"] },
];

async function seedMosaic() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Mosaic category
    let mosaicCat = await Category.findOne({ slug: 'mosaic' });
    if (!mosaicCat) {
      mosaicCat = await Category.create({ name: 'Mosaic', slug: 'mosaic' });
      console.log('+ Created Mosaic category');
    }

    // Remove old Mosaic products
    const deleted = await Product.deleteMany({ category: mosaicCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Mosaic products`);

    // Insert new products
    for (const p of newMosaicProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: mosaicCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Mosaic',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newMosaicProducts.length} Mosaic products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedMosaic();
