import { Request, Response } from "express";
import { processMessage, getFullSessionHistory } from "../services/chat.service";

const MAX_MESSAGE_LENGTH = 500;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0) {
      res.status(400).json({ error: "Message cannot be empty" });
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`,
      });
      return;
    }

    if (sessionId && typeof sessionId !== "string") {
      res.status(400).json({ error: "Invalid session ID format" });
      return;
    }

    const result = await processMessage(trimmedMessage, sessionId);

    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process message";
    res.status(500).json({ error: errorMessage });
  }
}

export async function handleGetHistory(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "Valid session ID is required" });
      return;
    }

    const history = await getFullSessionHistory(sessionId);

    if (!history) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json(history);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}
