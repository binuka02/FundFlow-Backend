const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  goal: { type: Number, required: true },
  programDescription: { type: String, required: true },
  image: { type: String },
  organizationEmail: { type: String, required: true },
  charityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  raised: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
