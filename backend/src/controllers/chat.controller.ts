import { Request, Response } from "express";
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import ApiResponse from "../utils/apiResponse";
import ErrorResponse from "../utils/apiError";
import User from "../models/user.model";
import mongoose, { mongo } from "mongoose";
import path from "path";

const createOrGetChat = async (req: Request, res: Response) => {
try {
    const user = (req as any).user;
    

    if (!user) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    const { otherUserId } = req.body;

    if (!otherUserId) {
        return res.status(400).json(new ErrorResponse(400, "Other user ID is required"));
    }

    if (otherUserId === user._id.toString()) {
        return res.status(400).json(new ErrorResponse(400, "Dude you can't create chat with yourself"));
    }
    
    const chat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [user._id, otherUserId] }
    })

    .populate("participants", "-password -refreshToken")
    .populate("lastMessage");

    if (chat) {
        return res
            .status(200)
            .json(new ApiResponse(200, "Chat fetched successfully", { chat }));
    }

    const newChat = new Chat({
        participants: [user._id, otherUserId],
        isGroupChat: false
    });

    const savedChat = await newChat.save();

    const fullChat = await Chat.findById(savedChat._id)
        .populate("participants", "-password -refreshToken")
        .populate("lastMessage");
    res
        .status(201)
        .json(new ApiResponse(201, "Chat created successfully", { chat: fullChat }));

    } catch (error) {
        res.status(500).json(new ErrorResponse(500, "Internal Server Error : " + error.message));
    }
};

const getUserChats = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
        }

        const chats = await Chat.find({
            participants: user._id}
        )

        .populate("participants", "username avatarUrl")
        .populate({
        path: "lastMessage",
        select: "senderId content createdAt messageType mediaUrl",
        populate: {
          path: "senderId",
          select: "username avatarUrl",
        },
        })
        .sort({ updatedAt: -1 });

        if (chats.length === 0) {
            return res.status(404).json(new ErrorResponse(200, "No chats found"));
        }

        res
        .status(200)
        .json(new ApiResponse(200, "Chats fetched successfully", { chats }));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, "Internal Server Error : " + error.message));
    }
};


const createGroupChat = async (req: Request, res: Response) => {
  try {
    const { groupChatName, participantIds } = req.body;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    const ids: string[] = participantIds as string[];

    if (!groupChatName || !ids || ids.length < 2) {
      return res.status(400).json(
        new ErrorResponse(
          400,
          "Group chat name and at least 2 participants are required"
        )
      );
    }

    if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json(
        new ErrorResponse(400, "Some participant IDs are invalid")
      );
    }

    
    const uniqueIds = Array.from(new Set(ids));


    const existingUsers = await User.find({
      _id: { $in: uniqueIds }
    }).select("_id");

    if (existingUsers.length !== uniqueIds.length) {
      return res.status(400).json(
        new ErrorResponse(400, "Some participant IDs do not correspond to valid users")
      );
    }

 
    const participants = Array.from(
      new Set([...uniqueIds, user._id.toString()])
    );

    const newGroupChat = await Chat.create({
      participants,
      isGroupChat: true,
      groupChatName
    });

    const fullGroupChat = await Chat.findById(newGroupChat._id)
      .populate("participants", "username avatarUrl");

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Group chat created successfully", { chat: fullGroupChat })
      );
  } catch (error: any) {
    return res
      .status(500)
      .json(
        new ErrorResponse(500, "Internal Server Error: " + error.message)
      );
  }
};



const renameGroupChat = async (req: Request, res: Response) => {
    try {
        const { chatId, newName } = req.body;
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
        }
        if (!chatId || !newName) {
            return res.status(400).json(new ErrorResponse(400, "Chat ID and new name are required"));
        }

        if(!newName.trim()){
            return res.status(400).json(new ErrorResponse(400, "Chat name cannot be empty"));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ErrorResponse(404, "Chat not found"));
        }

        if (!chat.isGroupChat) {
            return res.status(400).json(new ErrorResponse(400, "Must be a group chat"));
        }

        chat.groupChatName = newName;
        await chat.save();
        const updatedChat = await Chat.findById(chatId)
            .populate("participants", "username avatarUrl")
            .populate({
                path: "lastMessage",
                select: "senderId content createdAt messageType mediaUrl",
                populate: {
                    "path": "senderId",
                    select: "username avatarUrl",
                }
            });
        res
            .status(200)
            .json(new ApiResponse(200, "Group chat renamed successfully", { chat: updatedChat }));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, "Internal Server Error : " + error.message));
    }
};

const addUserToGroupChat = async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;
    const user = (req as any).user;
    if (!user) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
    if (!chatId || !userId) {
        return res.status(400).json(new ErrorResponse(400, "Chat ID and User ID are required"));
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json(new ErrorResponse(404, "Chat not found"));
    }

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json(new ErrorResponse(400, "Invalid chat ID or user ID"));
    }

    if (!chat.isGroupChat) {
        return res.status(400).json(new ErrorResponse(400, "Must be a group chat"));
    }

    const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            return res.status(404).json(new ErrorResponse(404, "User to add not found"));
        }


    if (chat.participants.includes(userId)) {
        return res.status(400).json(new ErrorResponse(400, "User is already a participant"));
    }

    
    await Chat.findByIdAndUpdate(
      chatId,
      { $push: { participants: userId } },
      { new: true }
    );

    
    const updatedChat = await Chat.findById(chatId)
        .populate("participants", "username avatarUrl")
        .populate({
            path: "lastMessage",
            select: "senderId content createdAt messageType mediaUrl",
            populate: {
                "path": "senderId",
                select: "username avatarUrl",
            }
        });
    res
        .status(200)
        .json(new ApiResponse(200, "User added to group chat successfully", { chat: updatedChat }));
};

const removeUserFromGroupChat = async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;
    const user = (req as any).user;
    if (!user) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
    if (!chatId || !userId) {
        return res.status(400).json(new ErrorResponse(400, "Chat ID and User ID are required"));
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json(new ErrorResponse(404, "Chat not found"));
    }

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json(new ErrorResponse(400, "Invalid chat ID or user ID"));
    }

    if (!chat.isGroupChat) {
        return res.status(400).json(new ErrorResponse(400, "Must be a group chat"));
    }

    const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            return res.status(404).json(new ErrorResponse(404, "User to remove not found"));
        }


    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(400).json(new ErrorResponse(400, "User is not a participant"));
    }

    
    await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: userId } },
      { new: true }
    );

    const updatedChat = await Chat.findById(chatId)
        .populate("participants", "username avatarUrl")
        .populate({
            path: "lastMessage",
            select: "senderId content createdAt messageType mediaUrl",
            populate: {
                "path": "senderId",
                select: "username avatarUrl",
            }
        });
    res
        .status(200)
        .json(new ApiResponse(200, "User removed from group chat successfully", { chat: updatedChat }));
};

export { createOrGetChat, getUserChats, createGroupChat, renameGroupChat, addUserToGroupChat, removeUserFromGroupChat };