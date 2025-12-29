const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ChatResponse {
  reply: string;
  sessionId: string;
}

interface HistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface HistoryResponse {
  sessionId: string;
  messages: HistoryMessage[];
}

export async function sendMessage(
  message: string,
  sessionId?: string | null
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sessionId: sessionId || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to send message");
  }

  return response.json();
}

export async function getHistory(sessionId: string): Promise<HistoryResponse | null> {
  const response = await fetch(`${API_URL}/chat/history/${sessionId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json();
}
