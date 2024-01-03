const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
    getMessages,
    createMessage,
} = require("../controllers/MessageController");

router.get("/:id", protect, getMessages); // get chat messages
router.post("/", protect, createMessage); // create a new message

module.exports = router;
