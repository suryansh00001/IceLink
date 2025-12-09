import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db";
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🧊 IceLink user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❄ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`❄️ IceLink backend running on port ${PORT}`);
});


