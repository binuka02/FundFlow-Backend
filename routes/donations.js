const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Post = require("../models/Post");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/record", async (req, res) => {
  const { postId, donorName, donorEmail, amount, sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed." });
    }

    const donation = new Donation({
      postId,
      donorName,
      donorEmail,
      amount,
      sessionId,
    });
    await donation.save();

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { raised: amount } },
      { new: true }
    );

    // ✅ Check if goal reached or exceeded
    if (post.raised + amount >= post.goal) {
      await Post.findByIdAndDelete(postId);
      console.log(`Post ${postId} deleted: goal reached.`);
    }

    res.status(201).json(donation);
  } catch (err) {
    console.error("Error recording donation:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get donations for organization view
router.get("/post/:postId", async (req, res) => {
  try {
    const donations = await Donation.find({ postId: req.params.postId });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate("postId", "programName");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
