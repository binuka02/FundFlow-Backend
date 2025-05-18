const express = require("express");
const router = express.Router();
const multer = require("multer");
const Gallery = require("../models/Gallery");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/**
 * POST /api/gallery
 * Upload gallery item with image
 */
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

/**
 * GET /api/gallery/home-slides
 * Return file names of images in /uploads/HomeSlide
 */
router.get("/home-slides", (req, res) => {
  const slideDir = path.join(__dirname, "..", "uploads", "HomeSlide");

  fs.readdir(slideDir, (err, files) => {
    if (err) {
      console.error("Error reading HomeSlide directory:", err);
      return res
        .status(500)
        .json({ error: "Unable to load home slide images" });
    }

    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    res.json(imageFiles);
  });
});

module.exports = router;
