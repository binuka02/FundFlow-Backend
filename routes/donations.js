const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Post = require("../models/Post");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Record donation (existing)
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

// Get leaderboard with filters
router.get("/leaderboard", async (req, res) => {
  try {
    const { range } = req.query; // 'day', 'week', 'month'
    let dateFilter = {};

    const now = new Date();
    if (range === "day") {
      dateFilter = {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      };
    } else if (range === "week") {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      dateFilter = { $gte: weekStart };
    } else if (range === "month") {
      dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    }

    const matchStage = range ? { createdAt: dateFilter } : {};

    const leaderboard = await Donation.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$donorName",
          totalPoints: { $sum: "$amount" },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
