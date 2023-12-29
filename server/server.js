// Import modules
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");


require("dotenv").config(); // Load environment variables from a .env file if present
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
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
//const chatRoomRoutes = require("./routes/chatRoomRoutes");

app.use('/api/user', userRoutes);
app.use("/api/messages", messageRoutes);
//app.use("/api/chatroom", chatRoomRoutes);

app.use(notFound);
app.use(errorHandler);

// Export the Express app for testing purposes
module.exports = app;
