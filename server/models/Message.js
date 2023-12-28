const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    chatRoomID: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;