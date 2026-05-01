const router = require("express").Router();
const auth = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");

router.post("/image", auth, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ url: req.file.path, publicId: req.file.filename });
  });
});

router.post("/images", auth, (req, res) => {
  upload.array("files", 10)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No files uploaded" });
    const files = req.files.map(f => ({ url: f.path, publicId: f.filename }));
    res.json(files);
  });
});

router.delete("/:publicId", auth, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: "File deleted from Cloudinary" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
