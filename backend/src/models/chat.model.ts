import mongoose from "mongoose";
import { Ichat } from "../types/chat";

export interface IChatModel extends Ichat, mongoose.Document {}


const chatSchema = new mongoose.Schema<IChatModel>({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  ],
  
  isGroupChat: { 
    type: Boolean,
    default: false
  },

    groupChatName: {
    type: String,
    default: "New Group Chat"
    },

    lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
    }

} , { timestamps: true });

const Chat = mongoose.model<IChatModel>("Chat", chatSchema);
export default Chat;