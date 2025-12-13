import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import { validateCreateChat } from "../middlewares/validation.middleware";
import { createOrGetChat, getUserChats, createGroupChat, renameGroupChat, addUserToGroupChat, removeUserFromGroupChat } from "../controllers/chat.controller";

const router = Router();
router.post("/", verifyToken, validateCreateChat, createOrGetChat);
router.get("/", verifyToken, getUserChats);
router.post("/group", verifyToken, validateCreateChat, createGroupChat);
router.put("/group/:id/rename", verifyToken, renameGroupChat);
router.put("/group/:id/adduser", verifyToken, addUserToGroupChat);
router.put("/group/:id/removeuser", verifyToken, removeUserFromGroupChat);

export default router;