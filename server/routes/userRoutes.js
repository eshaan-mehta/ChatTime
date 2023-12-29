const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
    allUsers,
    registerUser,
    authUser,
} = require("../controllers/UserController");

router.get('/', protect, allUsers);
router.post('/', registerUser);
router.post('/login', authUser);


module.exports = router;