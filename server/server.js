// Import modules
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config(); // Load environment variables from a .env file if present
// Create an Express app
connectDB()
const app = express();

// Middleware setup
app.use(cors({ origin: true, credentials: true })); // CORS setup for allowing cross-origin requests
app.use(express.json()); // Parse incoming JSON requests


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Routes setup
const messageRoutes = require("./routes/messages");
//const chatRoomRoutes = require("./routes/chatrooms");

app.use("/api/messages", messageRoutes);
//app.use("/api/chatroom", chatRoomRoutes);

// Export the Express app for testing purposes
module.exports = app;
