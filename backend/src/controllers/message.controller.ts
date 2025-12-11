import { Request, Response } from "express";
import User from "../models/user.model";
import Chat from "../models/chat.model";
import ApiResponse from "../utils/apiResponse";
import ErrorResponse from "../utils/apiError";
import Message from "../models/message.model";
import mongoose from "mongoose";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { getIO } from "../socket";


const sendMessage = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { chatId, content } = req.body;

        if(!user){
            return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
        }

        if (!chatId || !content) {
            return res.status(400).json(new ErrorResponse(400, "chatId and content are required"));
        }

        if(mongoose.Types.ObjectId.isValid(chatId) === false){
            return res.status(400).json(new ErrorResponse(400, "Invalid chatId"));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ErrorResponse(404, "Chat not found"));
        }

        const message = new Message({
            chatId,
            senderId: user._id,
            content,
            messageType: "text"
        });

        await message.save();


        await Chat.findByIdAndUpdate(
          chatId,
          { lastMessage: message._id },
          { new: true }
        );

        const fullMessage = await Message.findById(message._id)
          .populate("senderId", "username avatarUrl")
          .populate("chatId");

        const io = getIO();

        io.to(chatId.toString()).emit("newMessage", fullMessage);


        res.status(201).json(new ApiResponse(201, "Message sent successfully", { message: fullMessage }));
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json(new ErrorResponse(500, "Internal Server Error"+ error.message));
}
}

const sendMediaMessage = async (req: Request, res: Response) => {
    try {

    const {chatId} = req.body;
    const user = (req as any).user;
    const file = req.file;

    if(!user){
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    if (!chatId || !file) {
        return res.status(400).json(new ErrorResponse(400, "chatId and media file are required"));
    }

    if(mongoose.Types.ObjectId.isValid(chatId) === false){
        return res.status(400).json(new ErrorResponse(400, "Invalid chatId"));
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json(new ErrorResponse(404, "Chat not found"));
    }

    const messageType = file.mimetype.startsWith("image/") ? "image"
                      : file.mimetype.startsWith("video/") ? "video"
                      : "file";
    
    const uploadedUrl = await uploadToCloudinary(file.buffer, "media");

        const message = new Message({
            chatId,
            senderId: user._id,
            content: "",
            mediaUrl: uploadedUrl,
            messageType
        });

        await message.save();


        await Chat.findByIdAndUpdate(
          chatId,
          { lastMessage: message._id },
          { new: true }
        );


        const fullMessage = await Message.findById(message._id)
            .populate("senderId", "username avatarUrl") 
            .populate("chatId");

        const io = getIO();

        io.to(chatId.toString()).emit("newMessage", fullMessage);

        res.status(201).json(new ApiResponse(201, "Media message sent successfully", { message: fullMessage }));

        }
    
        catch (error) {
        console.error("Error sending media message:", error);
        res.status(500).json(new ErrorResponse(500, "Internal Server Error"+ error.message));
        }
    
       

    
}

const getMessages = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { chatId } = req.params;
        if(!user){
            return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
        }

        if(mongoose.Types.ObjectId.isValid(chatId) === false){
            return res.status(400).json(new ErrorResponse(400, "Invalid chatId"));
        }
        
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ErrorResponse(404, "Chat not found"));
        }
     
        if(!chat.participants.some(id => id.toString() === user._id.toString()))
        {
            return res.status(403).json(new ErrorResponse(403, "Forbidden: You are not a participant of this chat"));
        }

        const messages = await Message.find({ chatId })
            .populate("senderId", "username avatarUrl")
            .populate("chatId")
            .sort({ createdAt: 1 });


        res
        .status(200)
        .json(new ApiResponse(200, "Messages retrieved successfully", { messages }));
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res
        .status(500)
        .json(new ErrorResponse(500, "Internal Server Error"+ error.message));
    }
}

export { sendMessage, sendMediaMessage, getMessages };

