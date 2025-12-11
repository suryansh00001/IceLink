import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db";
connectDB();

import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import { initSocket } from "./socket";

const app = express();

// CORS must be before routes
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true, // Allow cookies
}));

app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);

// Initialize Socket.IO with authentication
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`❄️ IceLink backend running on port ${PORT}`);
});


