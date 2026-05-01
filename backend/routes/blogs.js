const router = require("express").Router();
const auth = require("../middleware/auth");
const createCrud = require("../utils/crudFactory");
const Blog = require("../models/Blog");
const crud = createCrud(Blog, "");

router.get("/", crud.getAll);
router.get("/slug/:slug", async (req, res) => {
  try {
    const doc = await Blog.findOne({ slug: req.params.slug });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", auth, crud.create);
router.put("/:id", auth, crud.update);
router.delete("/:id", auth, crud.remove);

module.exports = router;
