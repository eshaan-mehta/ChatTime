const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //removes preceding and trailing white space
      required: true,
    }, // custom name for gc, and contact name otherwise
    isGroupChat: {
      type: Boolean,
      default: false
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

modules.exports = Chat;
