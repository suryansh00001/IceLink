import { Types } from "mongoose";
export interface Ichat {
    _id: Types.ObjectId;
    participants: Types.ObjectId[];
    isGroupChat: boolean;
    groupChatName?: string;
    lastMessage?: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}