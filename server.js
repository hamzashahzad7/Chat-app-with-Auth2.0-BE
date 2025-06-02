const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const prisma = require("./utils/prisma-config");

const app = express();
const server = http.createServer(app);

// Socket Instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  if (req.ip) console.log(req.ip);
  res.send("<h1>Server Running</h1>");
});

// REST route to fetch previous messages
app.get("/messages/:room", async (req, res) => {
  const { room } = req.params;
  const messages = await prisma.message.findMany({
    where: { room },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("userJoined", (username) => {
    const message = `${username} has joined the chat`;
    console.log(message);
    socket.broadcast.emit("userNotification", message); //broadcast to all connected client excluding sender
  });

  socket.on("sendMessage", async ({ room, content, sender }) => {
    const message = await prisma.message.create({
      data: { room, content, sender },
    });

    io.to(room).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Listening on port
server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});