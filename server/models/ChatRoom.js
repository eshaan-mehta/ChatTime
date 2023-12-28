const mongoose = require("mongoose");

const ChatRoomSchema = mongoose.Schema(
  {
    name: String, // custom name for gc, and contact name otherwise
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    owner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

modules.exports = ChatRoom;
