const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Chat = require("../models/Chat");

// get all messages from the chat room
// TODO: have messages up to a certain prev date and user can get older messages
const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const messages = await Message.find({ chatRoomID: id }).sort({ createdAt: -1 })
        res.status(200).json(messages)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
});

// create message
const createMessage = asyncHandler(async (req, res) => {
    const { chatRoomID, message } = req.body;

    try {
        const newMessage = await Message.create ({
            chatRoomID, 
            sender: req.user._id,
            message,
        });

        const chat = await Chat.findByIdAndUpdate(chatRoomID, { latestMessage: newMessage._id, isTempChat: false }, { new: true })

        console.log(chat);

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




