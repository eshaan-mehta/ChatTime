const express = require("express");
const router = express.Router();

const {
    getMessages,
    createMessage,
} = require("../controllers/MessageController");

router.get("/:chatID", getMessages); // get chat messages
router.post("/", createMessage); // create a new message
