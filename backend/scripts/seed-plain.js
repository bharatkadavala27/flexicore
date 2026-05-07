const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Category = require('../models/Category');
const Product = require('../models/Product');

const newPlainProducts = [
  { slug: "pure-white", name: "Pure White", sku: "FC-101", description: "Classic pure white solid surface for a clean, minimalist look.", image: "/products/plain-surface/fc-101.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen Countertop", "Bathroom Vanity", "Healthcare"], features: ["Non-porous", "Hygienic", "Seamless"], industries: ["residential", "healthcare", "commercial"] },
  { slug: "super-white", name: "Super White", sku: "FC-102", description: "Ultra-bright white surface with exceptional clarity.", image: "/products/plain-surface/fc-102.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Modern Kitchen", "Reception", "Retail"], features: ["Ultra-bright", "Stain resistant", "Durable"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "sapphire-grey", name: "Sapphire Grey", sku: "FC-103", description: "Elegant sapphire grey with a smooth, matte finish.", image: "/products/plain-surface/fc-103.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office Desk", "Countertop", "Wall Panel"], features: ["Smooth texture", "Impact resistant", "Seamless joints"], industries: ["corporate", "commercial", "residential"] },
  { slug: "golden-brown", name: "Golden Brown", sku: "FC-104", description: "Warm golden brown for an inviting interior feel.", image: "/products/plain-surface/fc-104.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Restaurant Bar", "Kitchen", "Furniture"], features: ["Warm tones", "Non-porous", "Thermoformable"], industries: ["hospitality", "residential", "commercial"] },
  { slug: "ivory-plain", name: "Ivory", sku: "FC-105", description: "Classic ivory tone for timeless elegance.", image: "/products/plain-surface/fc-105.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bathroom", "Kitchen", "Lobby"], features: ["Timeless color", "Easy to clean", "Seamless"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "emeraid-green", name: "Emeraid Green", sku: "FC-106", description: "Vibrant emerald green for bold design statements.", image: "/products/plain-surface/fc-106.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Furniture", "Retail Display"], features: ["Vibrant color", "Durable", "Non-porous"], industries: ["commercial", "hospitality", "residential"] },
  { slug: "sand-stone-plain", name: "Sand Stone", sku: "FC-107", description: "Natural sand stone tone for grounded interiors.", image: "/products/plain-surface/fc-107.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Vanity", "Public Space"], features: ["Neutral palette", "Stain resistant", "Seamless"], industries: ["commercial", "residential", "hospitality"] },
  { slug: "crimson-red", name: "Crimson Red", sku: "FC-108", description: "Deep, passionate crimson red for high-energy spaces.", image: "/products/plain-surface/fc-108.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar", "Restaurant", "Statement Kitchen"], features: ["High contrast", "Durable", "Impact resistant"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "black-plain", name: "Black", sku: "FC-109", description: "Pure, deep black for ultimate sophistication.", image: "/products/plain-surface/fc-109.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Executive Office", "Luxury Kitchen", "Bar"], features: ["Sleek finish", "Non-porous", "Seamless joints"], industries: ["corporate", "residential", "hospitality"] },
  { slug: "leon-yellow", name: "Leon Yellow", sku: "FC-110", description: "Bright, sunny yellow to illuminate any project.", image: "/products/plain-surface/fc-110.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office", "Play Area", "Kitchen Accents"], features: ["Bright color", "Durable", "Easy maintenance"], industries: ["corporate", "commercial", "residential"] },
  { slug: "blue-ocean", name: "Blue Ocean", sku: "FC-111", description: "Calm and deep ocean blue solid surface.", image: "/products/plain-surface/fc-111.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Bathroom", "Feature Wall"], features: ["Water resistant", "Non-porous", "Seamless"], industries: ["hospitality", "residential", "healthcare"] },
  { slug: "cream-plain", name: "Cream", sku: "FC-112", description: "Rich cream tone for a soft and luxurious finish.", image: "/products/plain-surface/fc-112.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Vanity", "Lobby"], features: ["Soft aesthetic", "Easy to clean", "Non-porous"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "pista-plain", name: "Pista", sku: "FC-113", description: "Soft pista green for a fresh and modern look.", image: "/products/plain-surface/fc-113.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Healthcare", "Kitchen", "Office"], features: ["Fresh color", "Hygienic", "Seamless joints"], industries: ["healthcare", "residential", "corporate"] },
  { slug: "frost-grey", name: "Frost Grey", sku: "FC-114", description: "Cool frost grey for a sleek, industrial aesthetic.", image: "/products/plain-surface/fc-114.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Worktop", "Reception", "Wall Cladding"], features: ["Cool tones", "Non-porous", "Durable"], industries: ["corporate", "commercial", "residential"] },
  { slug: "light-gray-plain", name: "Light Gray", sku: "FC-115", description: "Versatile light gray for all-purpose design.", image: "/products/plain-surface/fc-115.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Floor", "Wall", "Countertop"], features: ["Durable", "Non-porous", "Seamless"], industries: ["commercial", "residential", "healthcare"] },
  { slug: "glacier-blue", name: "Glacier Blue", sku: "FC-116", description: "Crisp glacier blue for a clean and refreshing feel.", image: "/products/plain-surface/fc-116.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Healthcare", "Bathroom", "Retail Display"], features: ["Hygienic", "Non-porous", "Impact resistant"], industries: ["healthcare", "commercial", "hospitality"] },
  { slug: "baby-pink", name: "Baby Pink", sku: "FC-117", description: "Soft baby pink for a gentle and playful aesthetic.", image: "/products/plain-surface/fc-117.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Boutique", "Childcare", "Feature Wall"], features: ["Soft color", "Durable", "Non-porous"], industries: ["commercial", "residential", "hospitality"] },
  { slug: "warm-sand", name: "Warm Sand", sku: "FC-118", description: "Cozy warm sand tone for natural interior designs.", image: "/products/plain-surface/fc-118.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Kitchen", "Lobby", "Furniture"], features: ["Natural tones", "Seamless", "Non-porous"], industries: ["residential", "hospitality", "commercial"] },
  { slug: "purple-plain", name: "Purple", sku: "FC-119", description: "Rich purple for a luxurious and creative touch.", image: "/products/plain-surface/fc-119.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Bar Top", "Feature Wall", "Display"], features: ["Rich color", "Thermoformable", "Durable"], industries: ["hospitality", "commercial", "entertainment"] },
  { slug: "red-plain", name: "Red", sku: "FC-120", description: "Classic vibrant red for high-impact designs.", image: "/products/plain-surface/fc-120.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Restaurant", "Exhibition", "Kitchen"], features: ["Vibrant", "Non-porous", "Seamless joints"], industries: ["commercial", "hospitality", "residential"] },
  { slug: "ford-blue", name: "Ford Blue", sku: "FC-121", description: "Strong, industrial Ford Blue for reliable surfaces.", image: "/products/plain-surface/fc-121.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office", "Retail Display", "Workshop"], features: ["Strong color", "Impact resistant", "Non-porous"], industries: ["corporate", "commercial", "industrial"] },
  { slug: "chocolate-brown", name: "Chocolate Brown", sku: "FC-122", description: "Deep chocolate brown for a rich and earthy aesthetic.", image: "/products/plain-surface/fc-122.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Luxury Bar", "Kitchen", "Office Desk"], features: ["Earthy finish", "Durable", "Seamless"], industries: ["hospitality", "residential", "corporate"] },
  { slug: "slate-gray-plain", name: "Slate Gray", sku: "FC-123", description: "Deep slate gray for a professional and modern look.", image: "/products/plain-surface/fc-123.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Reception", "Public Restroom", "Commercial Space"], features: ["Non-porous", "Stain resistant", "Durable"], industries: ["commercial", "corporate", "healthcare"] },
  { slug: "pumpkin-orange", name: "Pumpkin Orange", sku: "FC-124", description: "Energetic pumpkin orange for creative environments.", image: "/products/plain-surface/fc-124.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Cafe", "Office Accent", "Furniture"], features: ["Vibrant color", "Seamless", "Non-porous"], industries: ["hospitality", "corporate", "residential"] },
  { slug: "nile-blue", name: "Nile Blue", sku: "FC-125", description: "Deep Nile blue for a serene and stable look.", image: "/products/plain-surface/fc-125.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Feature Wall", "Spa", "Lobby"], features: ["Deep color", "Non-porous", "Impact resistant"], industries: ["hospitality", "commercial", "residential"] },
  { slug: "olive-green-plain", name: "Olive Green", sku: "FC-126", description: "Muted olive green for organic and sophisticated designs.", image: "/products/plain-surface/fc-126.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Countertop", "Furniture", "Eco-Design"], features: ["Natural aesthetic", "Durable", "Non-porous"], industries: ["residential", "hospitality", "corporate"] },
  { slug: "dolphin-gray", name: "Dolphin Gray", sku: "FC-127", description: "Balanced dolphin gray for a soft and modern finish.", image: "/products/plain-surface/fc-127.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Office", "Kitchen", "Public Space"], features: ["Smooth finish", "Non-porous", "Seamless joints"], industries: ["corporate", "residential", "commercial"] },
  { slug: "shamrock-green", name: "Shamrock Green", sku: "FC-128", description: "Lucky shamrock green for a fresh and bright look.", image: "/products/plain-surface/fc-128.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Retail", "Cafe", "Play Area"], features: ["Bright color", "Non-porous", "Durable"], industries: ["commercial", "hospitality", "residential"] },
  { slug: "beige-brown", name: "Beige Brown", sku: "FC-129", description: "Balanced beige brown for warm, grounded interiors.", image: "/products/plain-surface/fc-129.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Lobby", "Residential Kitchen", "Vanity"], features: ["Warm neutral", "Stain resistant", "Seamless"], industries: ["hospitality", "residential", "commercial"] },
  { slug: "parrot-green", name: "Parrot Green", sku: "FC-130", description: "Exotic parrot green for vibrant and creative spaces.", image: "/products/plain-surface/fc-130.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Retail Display", "Creative Studio", "Cafe"], features: ["Vibrant hue", "Durable", "Non-porous"], industries: ["commercial", "hospitality", "corporate"] },
  { slug: "silver-mist-plain", name: "Silver Mist", sku: "FC-131", description: "Elegant silver mist for a clean, metallic-like aesthetic.", image: "/products/plain-surface/fc-131.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Modern Kitchen", "Reception", "Bathroom"], features: ["Light reflecting", "Non-porous", "Seamless joints"], industries: ["residential", "commercial", "hospitality"] },
  { slug: "deep-cocoa", name: "Deep Cocoa", sku: "FC-132", description: "Rich deep cocoa for a warm and premium feel.", image: "/products/plain-surface/fc-132.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Executive Desk", "Luxury Bar", "Kitchen"], features: ["Rich tones", "Impact resistant", "Durable"], industries: ["corporate", "hospitality", "residential"] },
  { slug: "moon-whisper", name: "Moon Whisper", sku: "FC-133", description: "Soft moon whisper grey for tranquil environments.", image: "/products/plain-surface/fc-133.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Spa", "Wellness Center", "Bedroom"], features: ["Soothing color", "Non-porous", "Hygienic"], industries: ["hospitality", "healthcare", "residential"] },
  { slug: "classic-cement", name: "Classic Cement", sku: "FC-134", description: "Industrial classic cement for modern minimalist design.", image: "/products/plain-surface/fc-134.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Modern Kitchen", "Worktop", "Floor Panel"], features: ["Raw aesthetic", "Easy maintenance", "Seamless"], industries: ["residential", "corporate", "commercial"] },
  { slug: "rustic-mustard", name: "Rustic Mustard", sku: "FC-135", description: "Deep rustic mustard for warm and characterful spaces.", image: "/products/plain-surface/fc-135.png", thickness: "12mm", dimensions: "3000 x 760 mm", applications: ["Cafe", "Boutique", "Residential Accent"], features: ["Warm rustic tone", "Durable", "Non-porous"], industries: ["hospitality", "commercial", "residential"] },
];

async function seedPlain() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Plain Surface category
    let plainCat = await Category.findOne({ $or: [{ slug: 'plain' }, { name: 'Plain Surface' }] });
    if (!plainCat) {
      plainCat = await Category.create({ name: 'Plain Surface', slug: 'plain' });
      console.log('+ Created Plain Surface category');
    } else {
      console.log('✅ Found existing Plain Surface category');
    }

    // Remove old Plain products
    const deleted = await Product.deleteMany({ category: plainCat._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old Plain Surface products`);

    // Insert new products
    for (const p of newPlainProducts) {
      await Product.create({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: plainCat._id,
        description: p.description,
        images: [{ url: p.image, publicId: p.slug }],
        gallery: [{ url: p.image, publicId: p.slug }],
        thickness: p.thickness,
        dimensions: p.dimensions,
        applications: p.applications,
        features: p.features,
        industries: p.industries,
        isVisible: true,
        surface: 'Plain Surface',
      });
      console.log(`+ Added: ${p.name} (${p.sku})`);
    }

    console.log(`\n✅ Seeded ${newPlainProducts.length} Plain Surface products!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedPlain();
