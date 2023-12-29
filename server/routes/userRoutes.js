const express = require("express");
const router = express.Router();

const {
    allUsers,
    registerUser,
    authUser,
} = require("../controllers/UserController");

router.get('/', allUsers);
router.post('/', registerUser);
router.post('/login', authUser);


module.exports = router;