import prisma from "../lib/prisma";
import { generateReply } from "./llm.service";

export async function getOrCreateSession(sessionId?: string) {
  if (sessionId) {
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (existingSession) {
      return existingSession;
    }
  }
  return prisma.session.create({ data: {} });
}

export async function getSessionHistory(sessionId: string) {
  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
  return messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
}

export async function getFullSessionHistory(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return null;
  }

  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });

  return {
    sessionId: session.id,
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  };
}

export async function saveMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.message.create({
    data: {
      sessionId,
      role,
      content,
    },
  });
}

export async function processMessage(message: string, sessionId?: string) {
  const session = await getOrCreateSession(sessionId);
  const history = await getSessionHistory(session.id);

  await saveMessage(session.id, "user", message);

  const reply = await generateReply(history, message);

  await saveMessage(session.id, "assistant", reply);

  return {
    reply,
    sessionId: session.id,
  };
}
