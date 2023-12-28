// Import modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from a .env file if present

// Create an Express app
const app = express();

// Middleware setup
app.use(cors({ origin: true, credentials: true })); // CORS setup for allowing cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB function
const connectToDatabase = (connectionString) => {
  // Close the existing connection before opening a new one
  mongoose.connection.close();

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB CONNECTED");

      // Handle MongoDB connection events
      mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

      startServer(); // Start the server once the database connection is successful
    })
    .catch((error) => {
      console.log("DB CONNECTION ERROR", error);
    });
};

// Start the server function
const startServer = () => {
  // Start the server
  app.listen(() => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

// Routes setup
const messageRoutes = require("./routes/messages");
const chatRoomRoutes = require("./routes/chatrooms");

app.use("/api/messages", messageRoutes); 
app.use("/api/chatroom", chatRoomRoutes);

// Initial connection to MongoDB using the provided URI
connectToDatabase(process.env.MONGO_URI);

// Export the Express app for testing purposes
module.exports = app;
