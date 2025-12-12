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
       
    io.on("connection", async (socket: authSocket) => {
            console.log("🧊 IceLink user connected:", socket.id, "User:", socket.user?.username);

            const userId = socket.user?._id;
            if (!userId) return;

            await User.findByIdAndUpdate(userId, {
                socketId: socket.id,
                isOnline: true
            }).exec();

            socket.join(userId.toString());

            const onlineUsers = await User.find({ isOnline: true }).select("_id").exec();
            const onlineUserIds = onlineUsers.map(u => u._id.toString());
            socket.emit("initialOnlineUsers", onlineUserIds);

            io.emit("onlineUsers", {
                userId,
                isOnline: true
            });

            socket.on("disconnect", async () => {
                console.log("❄ User disconnected:", socket.id);

                await User.findByIdAndUpdate(userId, {
                    socketId: null,
                    isOnline: false
                }).exec();

                io.emit("onlineUsers", {
                    userId,
                    isOnline: false
                });
            });



        socket.on("message-sent", (message: any) => {
            if (!message.chatId) {
                console.error("❌ Missing chatId in message:", message);
                return;
            }

            io.to(message.chatId.toString()).emit("message-received", message);
        });

        socket.on("joinChat", (chatId: string) => {
            socket.join(chatId);
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

        socket.on("callUser", (data: { to: string; signalData: any; from: string; name: string; callType: string }) => {
            io.to(data.to).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name,
                callType: data.callType,
            });
            console.log(`User ${socket.user?.username} is calling user ID ${data.to} (${data.callType})`);
        });

        socket.on("answerCall", (data: { to: string; signalData: any }) => {
            io.to(data.to).emit("callAccepted", data.signalData);
            console.log(`User ${socket.user?.username} answered call for user ID ${data.to}`);
        });

        socket.on("rejectCall", (data: { to: string }) => {
            io.to(data.to).emit("callRejected");
            console.log(`User ${socket.user?.username} rejected call for user ID ${data.to}`);
        });

        socket.on("cancelCall", (data: { to: string }) => {
            io.to(data.to).emit("callCanceled");
            console.log(`User ${socket.user?.username} canceled call for user ID ${data.to}`);
        });

        socket.on("userBusy", (data: { to: string }) => {
            io.to(data.to).emit("userBusy");
            console.log(`User ${socket.user?.username} is busy for user ID ${data.to}`);
        });

        socket.on("iceCandidate", (data: { to: string; candidate: any }) => {
            io.to(data.to).emit("iceCandidate", data.candidate);
            console.log(`User ${socket.user?.username} sent ICE candidate to user ID ${data.to}`);
        });

        socket.on("endCall", (data: { to: string }) => {
            io.to(data.to).emit("callEnded");
            console.log(`User ${socket.user?.username} ended call for user ID ${data.to}`);
        });


    });
};