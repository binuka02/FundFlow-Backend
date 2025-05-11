const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat"); // chat model
const User = require("../models/User"); // user model

// GET /api/chats/:userId → Get all chats for a user (donor or org)
router.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId })
      .populate("participants", "fullName role")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats" });
  }
});

// GET /api/messages/:chatId → Get messages for a chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "messages.sender",
      "fullName role"
    );
    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// POST /api/messages/:chatId → Send a message
router.post("/messages/:chatId", async (req, res) => {
  try {
    const { senderId, text } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    const message = { sender: senderId, text };
    chat.messages.push(message);
    await chat.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
});

module.exports = router;
