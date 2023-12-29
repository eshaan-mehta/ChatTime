const asyncHandler = require("express-async-handler");
const User = require('../models/User');
const generateToken = require("../config/generateToken");

const allUsers = asyncHandler(async (req, res) => {
    // searches for either name or email to match req.query.search, "i" = case insensitive
    const keyword = req.query.search ? {
        $or: [ 
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    // find all users matching this keyword except the current logged in one
    const users = await User.find(keyword).find({ _id: {$ne: req.user._id}})

    res.status(200).json(users);
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // check for missing fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please enter all fields." })
    }

    // check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).json({ error: "User already exists." });
    }

    // create new user
    const user = await User.create({ name, email, password, pic });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ error: "Failed to create User." });
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields." });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ error: "Invalid Email or Password" })
    }

});

module.exports = {
    allUsers,
    registerUser,
    authUser
};
