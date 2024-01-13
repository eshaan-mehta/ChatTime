// Import modules
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

require("dotenv").config(); // Load environment variables from a .env file if present

connectDB()
const app = express();

// Middleware setup
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // CORS setup for allowing cross-origin requests
app.use(express.json()); // Parse incoming JSON requests


// Routes setup
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use('/api/user', userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000, // close connection after 1 minute of inactivity to save bandwidth
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  console.log("Connected to Socket.IO");

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("User Connected");
  });

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chatRoomID;

    
    if (!chat.members || chat.members.length === 0) return console.log("Chat.members not defined");
    console.log(chat.members)

    chat.members.forEach((member) => {
      if (member._id == newMessage.sender._id) return;
      
      socket.in(member._id).emit("message received", newMessage);
    });
  });
});