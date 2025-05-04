const express = require("express");
const Feedback = require("../models/Feedback"); // create this model
const router = express.Router();

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new feedback
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Feedback text is required" });

    const feedback = new Feedback({ text });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
