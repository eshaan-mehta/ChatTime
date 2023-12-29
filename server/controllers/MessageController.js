const asyncHandler = require("express-async-handler")
const Message = require("../models/Message");

// get all messages from the chat room
// TODO: have messages up to a certain prev date and user can get older messages
const getMessages = asyncHandler(async (req, res) => {
    const { chatID } = req.params;
    
    try {
        const messages = await Message.find({ chatRoomID: chatID }).sort({ createdAT: -1 })
        res.status(200).json(messages)
    } catch (error) {
        res.status(404).json({ error: "Chat room not found." })
    }
});

// create message
const createMessage = asyncHandler(async (req, res) => {
    const { chatRoomID, sender, message } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(chatRoomID)) {
    //     return res.status(404).json({error: "Chat Room not found."});
    // }

    try {
        const newMessage = await Message.create ({
            chatRoomID, 
            sender,
            message,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});


//TODO: Edit + Delete message

// exporting all methods
module.exports = {
    getMessages,
    createMessage,
};




