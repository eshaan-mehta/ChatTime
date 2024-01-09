const asyncHandler = require("express-async-handler")
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const fetchChats = asyncHandler(async (req, res) => {
    let chats; 

    try {
        chats = await Chat.find( { members: { $elemMatch: { $eq: req.user._id } } })
        .populate("members", '-password')
        .populate("admin", '-password')
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      
        chats.forEach((chat) => {
            if (!chat.isGroupChat) {
                chat.name = (req.user.name === chat.members[0].name) ? chat.members[1].name : chat.members[0].name; 
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
    
});

const createChat = asyncHandler(async (req, res) => {
    const { userId, name } = req.body;

    if (!userId) {
        console.log("missing user id in request.");
        return res.sendStatus(400);
    }
    
    if (userId === req.user._id) {
        res.status(400).json({ error: "Cannot create chat with self" })
    }

    //check if chat with this user already exists
    const existingChat = await Chat.findOne({
        isGroupChat: false,
        members: { $size: 2, $all: [userId, req.user._id] }
    });

    if (existingChat) {
        return res.status(200).json(existingChat);
    }

    // create a new chat with two users
    try {
        const newChat = await Chat.create({
            name: name,
            isGroupChat: false,
            members: [req.user._id, userId],
        });

        const fullChat = await Chat.findById(newChat._id).populate("members", "-password");
        res.status(200).json(fullChat);
    } catch (error) {
        console.log("error")
        res.status(400).json({ error: error.message });
    }
    

});

const deleteChat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id? id : "no chat id");
    try {
        const deleted = await Chat.findByIdAndDelete(id);
        
        const deletedMessages = Message.findManyAndDelete({ chatRoomID: id });

        res.status(200).json(deleted);
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
    const { chatId, newName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            name: newName
        }, { new: true })
        .populate("members", "-password")
        .populate("admin", "-password");
    
        res.status(200).json(updatedChat); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const removeFromGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const removedMember = await Chat.findByIdAndUpdate(chatId, {
            $pull: { members: userId },
        }, { new: true })
        .populate("members", "-password")
        .populate("admin", "-password");
    
        res.status(200).json(removedMember);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const addToGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const addedMember = await Chat.findByIdAndUpdate(chatId, {
            $push: { members: userId },
        }, { new: true })
        .populate("members", "-password")
        .populate("admin", "-password");
    
        res.status(200).json(addedMember); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
    
module.exports = {
    fetchChats,
    createChat,
    deleteChat,
    createGroupChat,
    renameGroupChat,
    removeFromGroupChat,
    addToGroupChat
};