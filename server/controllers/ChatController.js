const asyncHandler = require("express-async-handler")
const Chat = require("../models/Chat");
const User = require("../models/User");

const fetchChats = asyncHandler(async (req, res) => {
    try {
        let chat = await Chat.find( { members: { $elemMatch: { $eq: req.user._id } } })
        .populate("members", '-password')
        .populate("admin", '-password')
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
        
        chat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).json(chat);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("missing user id in request.");
        return res.sendStatus(400);
    }

    // search for existing chat of two users
    let isChat = Chat.find({ 
        isGroupChat: false, 
        $and: [
            { members: { $elemMatch: { $eq: req.user._id } } },
            { members: { $elemMatch: { $eq: userId } } },
        ]
    })
    .populate("members", "-password") 
    .populate("latestMessage");

    // populate latest chat sender info
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    // chat exists
    if (isChat.length > 0) { 
        return res.status(200).json(isChat[0]);
    }  
    
    // create a new chat with two users
    try {
        const newChat = await Chat.create({
            name: "sender",
            isGroupChat: false,
            members: [req.user._id, userId]
        });

        const fullChat = await Chat.findById(newChat._id).populate("members", "-password");
        res.status(200).json(fullChat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    

});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.members || !req.body.name) {
        return res.status(400).json({ error: "Please fill all fields." });
    }

    // get all requested members for group chat
    let members = JSON.parse(req.body.members);
    if (members.length < 2) {
        return res.status(400).json({ error: "Minimum 3 users required for group chat." });
    }

    // add logged in user to group chat
    members.push(req.user);

    try {
        const gc = await Chat.create({
            name: req.body.name,
            isGroupChat: true,
            members: members,
            admin: req.user
        });

        const fullGC = await Chat.findById(gc._id)
        .populate("members", "-password")
        .populate("admin", "-password");

        res.status(200).json(fullGC);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const renameGroupChat = asyncHandler(async (req, res) => {
    
});

const removeFromGroupChat = asyncHandler(async (req, res) => {
    
});

const addToGroupChat = asyncHandler(async (req, res) => {
    
});
    
module.exports = {
    fetchChats,
    accessChat,
    createGroupChat,
    renameGroupChat,
    removeFromGroupChat,
    addToGroupChat
};