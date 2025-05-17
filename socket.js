const { Server } = require("socket.io");

let io;

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`🟡 ${socket.id} joined chat ${chatId}`);
    });

    socket.on("send-message", (msg) => {
      console.log("📤 Broadcasting message:", msg);
      io.to(msg.chatId).emit("receive-message", msg);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { setupSocket, getIO };
