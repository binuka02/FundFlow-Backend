const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");

// GET messages for a chat
router.get("/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "_id fullName")
      .populate("receiver", "_id fullName");
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// POST new message
router.post("/:chatId", async (req, res) => {
  const { senderId, text } = req.body;
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const receiverId = chat.participants.find((p) => p.toString() !== senderId);
    const message = new Message({
      chatId: chat._id,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    const saved = await message.save();

    const populated = await Message.findById(saved._id)
      .populate("sender", "_id fullName")
      .populate("receiver", "_id fullName");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Message send failed:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
