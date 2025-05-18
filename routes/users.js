const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users?role=donor&approved=true
router.get("/", async (req, res) => {
  try {
    const { role, approved } = req.query;
    const query = {};
    if (role) query.role = role;
    if (approved === "true") query.approved = true;
    else if (approved === "false") query.approved = false;

    const users = await User.find(query).select(
      "_id fullName email role description image occupation mobileNumber nicNumber nicDocument"
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id fullName email role description image occupation mobileNumber nicNumber nicDocument ongoingCharities"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// PUT /api/users/:id/approve
router.put("/:id/approve", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
