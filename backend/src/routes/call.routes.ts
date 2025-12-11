import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import { getCallHistory } from "../controllers/call.controller";

const router = Router();
router.get("/history", verifyToken, getCallHistory);

export default router;
