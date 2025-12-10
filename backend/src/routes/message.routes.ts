import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
import { getMessages, sendMediaMessage, sendMessage} from "../controllers/message.controller";

const router = Router();

router.get("/:chatId", verifyToken, getMessages);
router.post("/", verifyToken, sendMessage);
router.post("/media", verifyToken, upload.single("file"), sendMediaMessage);

export default router;


