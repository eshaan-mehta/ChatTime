const mongoose = require("mongoose");

const ChatRoomSchema = mongoose.Schema(
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

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

modules.exports = ChatRoom;
