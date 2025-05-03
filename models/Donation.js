const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    donorName: String,
    donorEmail: String,
    amount: Number,
    sessionId: String,
  },
  { timestamps: true }
); // ← this enables createdAt and updatedAt

module.exports = mongoose.model("Donation", donationSchema);
