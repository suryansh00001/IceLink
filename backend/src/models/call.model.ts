import mongoose from "mongoose";
import { Icall } from "../types/call";

export interface ICallModel extends Icall, mongoose.Document {}

const callSchema = new mongoose.Schema<ICallModel>({
    callerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    callType: {
        type: String,
        enum: ["audio", "video"],   
        required: true
    },
    status: {
        type: String,
        enum: ["ongoing", "ended", "missed" , "rejected"],
        default: "ongoing"
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date,
        default: null
    }
} , { timestamps: true });

const Call = mongoose.model<ICallModel>("Call", callSchema);
export default Call;