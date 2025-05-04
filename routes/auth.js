const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", upload.single("nicDocument"), async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      occupation,
      mobileNumber,
      nicNumber,
      role,
    } = req.body;
    const nicDocument = req.file ? req.file.filename : null;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      passwordHash,
      occupation,
      mobileNumber,
      nicNumber,
      nicDocument,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or role" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.fullName, // ✅ include name for frontend
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by email
router.get("/users/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-passwordHash"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      organizationName,
      organizationEmail,
      contactNumber,
      description,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (currentPassword && newPassword && confirmNewPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      if (newPassword !== confirmNewPassword)
        return res.status(400).json({ message: "New passwords do not match" });
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    user.fullName = organizationName || user.fullName;
    user.email = organizationEmail || user.email;
    user.mobileNumber = contactNumber || user.mobileNumber;
    user.description = description || user.description;

    if (req.file) {
      user.image = req.file.filename;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get users (with optional role filter)
router.get("/users", async (req, res) => {
  try {
    const role = req.query.role;
    let query = {};
    if (role) {
      query.role = role;
    }
    const users = await User.find(query).select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
