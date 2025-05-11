const express = require("express");
const router = express.Router();
const multer = require("multer");
const Gallery = require("../models/Gallery");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST /api/gallery → Add new gallery item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const galleryItem = new Gallery({
      programName: req.body.programName,
      image: req.file.filename,
      alt: req.body.alt || `${req.body.programName} image`,
    });
    await galleryItem.save();
    res.status(201).json({ message: "Gallery item saved!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving gallery item" });
  }
});

// GET /api/gallery → Get all gallery items
router.get("/", async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    res.json(galleryItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching gallery items" });
  }
});

module.exports = router;
