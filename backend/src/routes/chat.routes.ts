import { Router } from "express";
import { handleChatMessage, handleGetHistory } from "../controllers/chat.controller";

const router = Router();

router.post("/message", handleChatMessage);
router.get("/history/:sessionId", handleGetHistory);

export default router;
