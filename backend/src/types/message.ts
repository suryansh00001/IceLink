import { Types } from "mongoose";
export interface IMessage {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    content?: string | "";
    mediaUrl?: string | null;
    messageType: "text" | "image" | "video" | "file";
    createdAt: Date;
    updatedAt: Date;
}