import { Request, Response} from "express";
import Call from "../models/call.model";
import ErrorResponse from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import mongoose from "mongoose";


const getCallHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const calls = await Call.find({
            $or: [
                { callerId: userId },
                { receiverId: userId }
            ]
        })
        .populate("callerId", "username avatarUrl")
        .populate("receiverId", "username avatarUrl")
        .sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, "Call history retrieved successfully", calls));
    } catch (error: any) {
        console.error("Get Call History error:", error.stack || error);
        return res.status(500).json(new ErrorResponse(500, `Server error : ${error.message}`));
    }
};

export {
    getCallHistory
};