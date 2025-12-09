import { Types } from "mongoose";
export interface Icall {
    _id: Types.ObjectId;
    callerId: Types.ObjectId;
    receiverId: Types.ObjectId;
    callType: "audio" | "video";
    status: "ongoing" | "ended" | "missed" | "rejected";
    startedAt: Date;
    endedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}