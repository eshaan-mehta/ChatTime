import mongoose from "mongoose";

const ChatRoomSchema = mongoose.Schema(
  {
    name: String, // custom name for gc, and contact name otherwise
    members: Array,
    owner: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;