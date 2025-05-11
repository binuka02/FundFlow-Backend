const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users?role=donor or /api/users?role=charity
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select(
      "_id fullName email role description image occupation mobileNumber nicNumber nicDocument"
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /api/users/:id → Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id fullName email role description image occupation mobileNumber nicNumber nicDocument ongoingCharities"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = router;
