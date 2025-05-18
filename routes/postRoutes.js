const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Create post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      programName,
      goal,
      programDescription,
      organizationEmail,
      charityId,
    } = req.body;

    const post = new Post({
      programName,
      goal,
      programDescription,
      image: req.file?.filename || null,
      organizationEmail,
      charityId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const { charityId } = req.query;
    const filter = charityId ? { charityId } : {};
    const posts = await Post.find(filter);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET posts by organization email
router.get("/by-email/:email", async (req, res) => {
  try {
    const posts = await Post.find({ organizationEmail: req.params.email });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by email:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Update a post
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { programName, goal, programDescription } = req.body;

    const updatedFields = {
      programName,
      goal,
      programDescription,
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/posts.js
// router.post("/update-donation/:id", async (req, res) => {
//   try {
//     const { donationAmount } = req.body;
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     post.raised += donationAmount;
//     await post.save();

//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
