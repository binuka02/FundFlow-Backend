const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    programName: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
