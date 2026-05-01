const router = require("express").Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Blog = require("../models/Blog");
const Category = require("../models/Category");

router.get("/", auth, async (req, res) => {
  try {
    const [products, blogs, categories] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments(),
      Category.countDocuments(),
    ]);
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    const visibleProducts = await Product.countDocuments({ isVisible: true });
    const recentBlogs = await Blog.find().sort("-createdAt").limit(5).select("title isPublished createdAt author");
    res.json({ products, blogs, categories, publishedBlogs, visibleProducts, recentBlogs });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
