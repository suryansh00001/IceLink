import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
import { messageLimiter, uploadLimiter } from "../middlewares/rateLimiter.middleware";
import { validateMessage } from "../middlewares/validation.middleware";
import { getMessages, sendMediaMessage, sendMessage} from "../controllers/message.controller";

const router = Router();

router.get("/:chatId", verifyToken, getMessages);
router.post("/", verifyToken, messageLimiter, validateMessage, sendMessage);
router.post("/media", verifyToken, uploadLimiter, upload.single("file"), sendMediaMessage);

export default router;


