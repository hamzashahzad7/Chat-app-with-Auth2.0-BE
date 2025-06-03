const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const prisma = require("./utils/prisma-config");
const getSentiment = require("./utils/getSentiment"); // Hugging Face sentiment util

const app = express();
const server = http.createServer(app);

// Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  if (req.ip) console.log("Visitor IP:", req.ip);
  res.send("<h1>Server Running</h1>");
});

// REST endpoint to fetch previous messages by room
app.get("/messages/:room", async (req, res) => {
  const { room } = req.params;

  const messages = await prisma.message.findMany({
    where: { room },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
});

// Real-time events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific room
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Broadcast a welcome message when a user joins (excluding the user)
  socket.on("userJoined", (username) => {
    const message = `${username} has joined the chat`;
    socket.broadcast.emit("userNotification", message);
  });

  // When a user sends a message
  socket.on("sendMessage", async ({ room, content, sender }) => {
    const sentiment = await getSentiment(content);

    const message = await prisma.message.create({
      data: { room, content, sender, sentiment },
    });

    io.to(room).emit("newMessage", { ...message, sentiment });

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
