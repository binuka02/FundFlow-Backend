const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. .jpg, .png, .pdf
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP
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

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const nicDocument = req.file ? req.file.filename : null;

    const user = new User({
      fullName,
      email,
      passwordHash,
      occupation,
      mobileNumber,
      nicNumber,
      nicDocument,
      role,
      approved: false,
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully. Awaiting admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user)
      return res.status(400).json({ message: "Invalid email or role" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!user.approved) {
      return res
        .status(403)
        .json({ message: "Your account is awaiting admin approval." });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        approved: user.approved,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle password update
    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res
          .status(400)
          .json({ message: "All password fields are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    if (organizationName) user.fullName = organizationName;
    if (organizationEmail) user.email = organizationEmail;
    if (contactNumber) user.mobileNumber = contactNumber;
    if (description) user.description = description;
    if (req.file) user.image = req.file.filename;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        description: user.description,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user by email
router.get("/users/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      description: user.description || "",
      image: user.image || "",
    });
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
