// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   text: String,
//   createdAt: { type: Date, default: Date.now },
// });

const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
