const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // ✅ ADD THIS
const { setupSocket } = require("./socket");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");
const checkoutRoutes = require("./routes/stripeRoute");
const donations = require("./routes/donations");
const feedbacks = require("./routes/feeebackRoutes");
const gallery = require("./routes/gallery");
const users = require("./routes/users");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/messageRoutes");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // ✅ CREATE HTTP SERVER

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/create-checkout-session", checkoutRoutes);
app.use("/api/donations", donations);
app.use("/api/feedbacks", feedbacks);
app.use("/api/gallery", gallery);
app.use("/api/users", users);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Setup Socket.IO with the HTTP server
setupSocket(server);

// ✅ Start using the raw server (not app.listen!)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
