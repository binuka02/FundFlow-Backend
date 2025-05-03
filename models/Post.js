const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  programName: String,
  goal: Number,
  programDescription: String,
  image: String,
  organizationEmail: String,
  raised: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
