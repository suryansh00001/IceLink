import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import ErrorResponse from "../utils/apiError";
import mongoose from "mongoose";



type authSocket = Socket & {
    user?: any;
};



let io: Server;

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

export const initSocket = (server: httpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use(async (socket: authSocket, next) => {
        try {
            const bearerHeader = socket.handshake.headers.authorization;
            const authToken = socket.handshake.auth?.token;
            const queryToken = socket.handshake.query?.token;
            
            let token = null;
            
            if (bearerHeader?.startsWith("Bearer ")) {
                token = bearerHeader.split(" ")[1];
            } else if (authToken) {
                token = authToken;
            } else if (queryToken && typeof queryToken === 'string') {
                token = queryToken;
            }
            
            if (!token) {
                return next(new Error("Unauthorized - no token"));
            }
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET not configured");
            }
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select("-password -refreshToken");

            if (!user) {
                return next(new Error("Invalid token - user not found"));
            }
            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Unauthorized: " + (error as Error).message));
        }

    });
    io.on("connection", (socket: authSocket) => {
        console.log("🧊 IceLink user connected:", socket.id, "User:", socket.user?.username)
        const userId = socket.user?._id;
        if (userId) {
            User.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true }).exec();
        }
        socket.join(userId.toString());
        socket.on("disconnect", () => {
            console.log("❄ User disconnected:", socket.id);
            if (userId) {
                User.findByIdAndUpdate(userId, { socketId: null, isOnline: false }).exec();
            }
        });

        socket.on("joinChat", (chatId: string) => {
            socket.join(chatId);
            console.log(`User ${socket.user?.username} joined chat ${chatId}`);
        });

        socket.on("typing", (chatId: string) => {
            socket.to(chatId).emit("typing", { chatId, userId: socket.user?._id });
            console.log(`User ${socket.user?.username} is typing in chat ${chatId}`);
        });

        socket.on("stopTyping", (chatId: string) => {
            socket.to(chatId).emit("stopTyping", { chatId, userId: socket.user?._id });
            console.log(`User ${socket.user?.username} stopped typing in chat ${chatId}`);
        }
        );


    });
};