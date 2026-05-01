const router = require("express").Router();
const auth = require("../middleware/auth");
const createCrud = require("../utils/crudFactory");
const Product = require("../models/Product");
const crud = createCrud(Product, "category");

router.get("/", crud.getAll);
router.get("/slug/:slug", async (req, res) => {
  try {
    const doc = await Product.findOne({ slug: req.params.slug }).populate("category");
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get("/:id", crud.getOne);
router.post("/", auth, crud.create);
router.put("/:id", auth, crud.update);
router.delete("/:id", auth, crud.remove);

module.exports = router;
