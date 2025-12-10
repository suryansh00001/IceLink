import mongoose from "mongoose";
import { IMessage } from "../types/message";
export interface IMessageModel extends IMessage, mongoose.Document {}

const messageSchema = new mongoose.Schema<IMessageModel>({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },

    senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },

    content: {
    type: String,
    default: ""
    },

    mediaUrl: {
    type: String,
    default: null
    },

    messageType: {
    type: String,
    enum: ["text", "image", "video", "file"],
    default: "text"
    }
} , { timestamps: true });


const Message = mongoose.model<IMessageModel>("Message", messageSchema);
export default Message;