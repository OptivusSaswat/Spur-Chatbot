import { create } from "zustand";

const SESSION_STORAGE_KEY = "spur_chat_session_id";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  addMessage: (role: "user" | "assistant", content: string) => void;
  setMessages: (messages: Message[]) => void;
  setSessionId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
  loadSessionId: () => string | null;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,

  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role,
          content,
          createdAt: new Date(),
        },
      ],
    })),

  setMessages: (messages) => set({ messages }),

  setSessionId: (id) => {
    if (id) {
      localStorage.setItem(SESSION_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    set({ sessionId: id });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearChat: () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    set({ messages: [], sessionId: null, error: null });
  },

  loadSessionId: () => {
    const storedId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedId) {
      set({ sessionId: storedId });
    }
    return storedId;
  },
}));
