const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat"); // chat model
// const User = require("../models/User"); // user model

// // GET /api/chats/:userId → Get all chats for a user (donor or org)
// router.get("/:userId", async (req, res) => {
//   try {
//     const chats = await Chat.find({ participants: req.params.userId })
//       .populate("participants", "fullName role")
//       .sort({ updatedAt: -1 });
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching chats" });
//   }
// });

// GET /api/messages/:chatId → Get messages for a chat
// router.get("/messages/:chatId", async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.chatId).populate(
//       "messages.sender",
//       "fullName role"
//     );
//     res.json(chat.messages);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });

// // POST /api/messages/:chatId → Send a message
// router.post("/messages/:chatId", async (req, res) => {
//   try {
//     const { senderId, text } = req.body;
//     const chat = await Chat.findById(req.params.chatId);
//     const message = { sender: senderId, text };
//     chat.messages.push(message);
//     await chat.save();
//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Error sending message" });
//   }
// });

// POST /api/chats/initiate
router.post("/initiate", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId] });
      await chat.save();
    }

    res.json({ chatId: chat._id });
  } catch (err) {
    console.error("Chat initiation failed", err);
    res.status(500).json({ error: "Failed to initiate chat" });
  }
});

// GET chat by ID
router.get("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "participants",
      "_id fullName"
    );
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// GET chats for a user
router.get("/my-chats/:orgId", async (req, res) => {
  const chats = await Chat.find({ participants: req.params.orgId }).populate(
    "participants",
    "_id fullName"
  );
  res.json(chats);
});

module.exports = router;
