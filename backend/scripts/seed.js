const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');

const productsData = [
  {
    slug: "calacatta-greige",
    name: "Calacatta Greige",
    sku: "FC-MB-101",
    categorySlug: "marble",
    description: "Warm greige veining on a soft ivory base.",
    longDescription: "Calacatta Greige features dramatic greige veining over a warm ivory base, capturing the timeless elegance of Italian Calacatta marble with the durability and hygiene of solid surface.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    ],
    hue: "White",
    region: "Europe",
    isNew: true,
    thickness: "12mm / 20mm",
    dimensions: "3200 x 1600 mm",
    applications: ["Kitchen Countertop", "Vanity", "Feature Wall", "Flooring"],
    features: ["Non-porous", "Stain resistant", "Seamless joints", "Thermoformable"],
    industries: ["residential", "hospitality", "commercial"],
    videoUrl: "https://cdn.coverr.co/videos/coverr-marble-kitchen-island-4000/1080p.mp4",
  },
  {
    slug: "noir-obsidian",
    name: "Noir Obsidian",
    sku: "FC-PL-202",
    categorySlug: "plain",
    description: "A deep, velvety black with a soft matte finish.",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    ],
    hue: "Black",
    region: "Global",
    isNew: true,
    isEco: true,
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Reception Desk", "Countertop", "Bar Top"],
    features: ["Non-porous", "Anti-bacterial", "Repairable", "Recycled content"],
    industries: ["corporate", "hospitality", "commercial"],
    videoUrl: "https://cdn.coverr.co/videos/coverr-modern-black-kitchen-8124/1080p.mp4",
  },
  {
    slug: "sandstone-beige",
    name: "Sandstone Beige",
    sku: "FC-AL-303",
    categorySlug: "alabaster",
    description: "Soft beige with fine natural speckles.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"],
    hue: "Beige",
    region: "Middle East",
    isNew: true,
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Healthcare", "Hospitality", "Retail"],
    features: ["Warm tone", "Hygienic", "Thermoformable"],
    industries: ["healthcare", "hospitality", "residential"],
  },
  {
    slug: "arctic-vein",
    name: "Arctic Vein",
    sku: "FC-MB-104",
    categorySlug: "marble",
    description: "Crisp white with dramatic grey veins.",
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1600&q=80"],
    hue: "White",
    region: "Global",
    thickness: "12mm / 20mm",
    dimensions: "3200 x 1600 mm",
    applications: ["Kitchen", "Bathroom", "Lobby"],
    features: ["Book-matched slabs", "Seamless", "Non-porous"],
    industries: ["residential", "hospitality", "corporate"],
  },
  {
    slug: "ivory-linen",
    name: "Ivory Linen",
    sku: "FC-PL-105",
    categorySlug: "plain",
    description: "Clean ivory with a subtle linen texture.",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80"],
    hue: "White",
    region: "Global",
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Hospitality", "Healthcare", "Residential"],
    features: ["Hygienic", "Low maintenance"],
    industries: ["healthcare", "hospitality", "residential"],
  },
  {
    slug: "galaxy-sparkle",
    name: "Galaxy Sparkle",
    sku: "FC-SP-106",
    categorySlug: "sparkle",
    description: "Deep charcoal with metallic flecks.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"],
    hue: "Black",
    region: "Global",
    isNew: true,
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Reception", "Bar", "Feature Wall"],
    features: ["Light-reactive", "Non-porous", "Thermoformable"],
    industries: ["commercial", "corporate", "hospitality"],
  },
  {
    slug: "honey-onyx",
    name: "Honey Onyx",
    sku: "FC-TR-107",
    categorySlug: "translucent",
    description: "Amber translucent slab that glows from within.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"],
    hue: "Beige",
    region: "Middle East",
    thickness: "6mm / 12mm",
    dimensions: "2400 x 760 mm",
    applications: ["Backlit Wall", "Bar", "Reception Desk"],
    features: ["Translucent", "Backlit-ready", "Seamless"],
    industries: ["hospitality", "commercial", "corporate"],
  },
  {
    slug: "azure-mosaic",
    name: "Azure Mosaic",
    sku: "FC-MO-108",
    categorySlug: "mosaic",
    description: "Blue mosaic-inspired pattern.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"],
    hue: "Blue",
    region: "Global",
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Spa", "Pool", "Bathroom"],
    features: ["Waterproof", "Non-porous", "Seamless"],
    industries: ["hospitality", "residential", "healthcare"],
  },
  {
    slug: "forest-green",
    name: "Forest Green",
    sku: "FC-PL-109",
    categorySlug: "plain",
    description: "Rich deep green inspired by ancient forests.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80"],
    hue: "Green",
    region: "Global",
    isEco: true,
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Furniture", "Feature Wall", "Reception"],
    features: ["Recycled content", "Hygienic"],
    industries: ["corporate", "hospitality", "commercial"],
  },
  {
    slug: "rose-alabaster",
    name: "Rose Alabaster",
    sku: "FC-AL-110",
    categorySlug: "alabaster",
    description: "Soft rose with warm veining.",
    image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1600&q=80"],
    hue: "Burgundy",
    region: "Europe",
    isNew: true,
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Retail", "Hospitality"],
    features: ["Thermoformable", "Seamless"],
    industries: ["hospitality", "commercial", "residential"],
  },
  {
    slug: "cloud-white",
    name: "Cloud White",
    sku: "FC-PL-111",
    categorySlug: "plain",
    description: "Clean bright white with subtle cloud-like movement.",
    image: "https://images.unsplash.com/photo-1513865126512-5ea172f24d7c?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1513865126512-5ea172f24d7c?auto=format&fit=crop&w=1600&q=80"],
    hue: "White",
    region: "Global",
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Kitchen", "Bath", "Commercial"],
    features: ["Hygienic", "Non-porous", "Repairable"],
    industries: ["residential", "healthcare", "commercial"],
  },
  {
    slug: "copper-vein",
    name: "Copper Vein",
    sku: "FC-MO-112",
    categorySlug: "mosaic",
    description: "Copper-toned metallic mosaic pattern.",
    image: "https://images.unsplash.com/photo-1496395035753-7da72844d0b2?auto=format&fit=crop&w=1600&q=80",
    gallery: ["https://images.unsplash.com/photo-1496395035753-7da72844d0b2?auto=format&fit=crop&w=1600&q=80"],
    hue: "Orange",
    region: "Global",
    thickness: "12mm",
    dimensions: "3000 x 760 mm",
    applications: ["Bar Top", "Reception", "Feature Wall"],
    features: ["Metallic finish", "Seamless"],
    industries: ["hospitality", "commercial", "corporate"],
  },
];

const blogData = [
  {
    slug: "designing-with-calacatta-greige",
    title: "Designing with Calacatta Greige",
    excerpt: "How our newest marble-inspired color is reshaping kitchens this season.",
    content: "Calacatta Greige captures the quiet luxury trend while delivering the hygiene and seamlessness of solid surface. Here's how designers are specifying it...",
    image: "/marble-calacatta-greige.jpg",
    category: "Design",
    author: "Priya Raman",
    isPublished: true,
  },
  {
    slug: "solid-surface-vs-quartz",
    title: "Solid Surface vs. Quartz: A fabricator's guide",
    excerpt: "The real differences that matter when specifying for a client project.",
    content: "Solid surface and quartz are often compared, but each has a distinct profile. Solid surface is thermoformable, seamless, repairable, and inherently non-porous...",
    image: "/fabricator-workshop.jpg",
    category: "Technical",
    author: "Daniel Osei",
    isPublished: true,
  },
  {
    slug: "sustainability-report-2026",
    title: "Sustainability Report 2026",
    excerpt: "A year in numbers: recycled content, renewable energy, and closed-loop water.",
    content: "In 2026 we reached 42% recycled content across our plain surface range, 100% solar-powered manufacturing at our Pune facility, and zero process water to drain...",
    image: "/sustainability-factory-solar.jpg",
    category: "Sustainability",
    author: "Maya Fernandes",
    isPublished: true,
  },
  {
    slug: "thermoforming-masterclass",
    title: "Thermoforming masterclass",
    excerpt: "A practical guide to shaping solid surface without cracks or visible seams.",
    content: "Thermoforming is where solid surface really shines. The key is consistent, gentle heat and a clamp pattern that avoids stress risers...",
    image: "/thermoforming-workshop.jpg",
    category: "Technical",
    author: "Ibrahim Saleh",
    isPublished: true,
  },
  {
    slug: "hospitality-trends-2026",
    title: "Hospitality design trends 2026",
    excerpt: "Biophilic accents, translucent surfaces, and sculptural reception desks.",
    content: "Hospitality interiors in 2026 are leaning into tactile materials and sculptural shapes. Translucent solid surfaces with integrated lighting are among the most requested finishes...",
    image: "/luxury-hotel-lobby.jpg",
    category: "Trends",
    author: "Lina Park",
    isPublished: true,
  },
  {
    slug: "behind-the-color-lab",
    title: "Behind the color lab",
    excerpt: "A rare glimpse inside the Flexicore color development studio.",
    content: "Every new Flexicore color starts life as hundreds of lab pours. We test under daylight, halogen, and LED before a single slab enters production...",
    image: "/color-laboratory.jpg",
    category: "Studio",
    author: "Priya Raman",
    isPublished: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Categories (if not already handled, but we have some)
    const categoryMap = {};
    const categories = await Category.find();
    categories.forEach(c => {
      categoryMap[c.slug] = c._id;
    });

    // Make sure we have the slugs we expect
    const expectedCategories = [
      { name: 'Alabaster', slug: 'alabaster' },
      { name: 'Marble', slug: 'marble' },
      { name: 'Mosaic', slug: 'mosaic' },
      { name: 'Sparkle', slug: 'sparkle' },
      { name: 'Translucent', slug: 'translucent' },
      { name: 'Plain Surface', slug: 'plain' },
    ];

    for (const cat of expectedCategories) {
      let existing = await Category.findOne({ $or: [{ slug: cat.slug }, { name: cat.name }] });
      if (!existing) {
        existing = await Category.create(cat);
        console.log(`+ Added Category: ${cat.name}`);
      }
      categoryMap[cat.slug] = existing._id;
      // Also map common variations
      if (cat.slug === 'plain') categoryMap['plain-surface'] = existing._id;
    }

    // Seed Products
    for (const p of productsData) {
      const existing = await Product.findOne({ slug: p.slug });
      if (!existing) {
        const catId = categoryMap[p.categorySlug] || categoryMap['plain'];
        await Product.create({
          ...p,
          category: catId,
          images: [{ url: p.image, publicId: 'manual' }],
          gallery: p.gallery.map(url => ({ url, publicId: 'manual' })),
        });
        console.log(`+ Added Product: ${p.name}`);
      }
    }

    // Seed Blogs
    for (const b of blogData) {
      const existing = await Blog.findOne({ slug: b.slug });
      if (!existing) {
        await Blog.create({
          ...b,
          featuredImage: { url: b.image, publicId: b.slug },
        });
        console.log(`+ Added Blog: ${b.title}`);
      }
    }

    console.log('✅ Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
