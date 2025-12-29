import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";
import { sendMessage, getHistory } from "@/services/api";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

export function Chat() {
  const {
    messages,
    sessionId,
    isLoading,
    addMessage,
    setMessages,
    setSessionId,
    setLoading,
    clearChat,
    loadSessionId,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initializeChat = async () => {
      const storedSessionId = loadSessionId();

      if (storedSessionId) {
        try {
          const history = await getHistory(storedSessionId);
          if (history && history.messages.length > 0) {
            setMessages(
              history.messages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                createdAt: new Date(m.createdAt),
              }))
            );
          }
        } catch (err) {
          console.error("Failed to load history:", err);
        }
      }

      setIsLoadingHistory(false);
    };

    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (message: string) => {
    addMessage("user", message);
    setLoading(true);

    try {
      const response = await sendMessage(message, sessionId);
      setSessionId(response.sessionId);
      addMessage("assistant", response.reply);
    } catch {
      addMessage(
        "assistant",
        "I'm sorry, I couldn't process your request right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    clearChat();
  };

  if (isLoadingHistory) {
    return (
      <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Spur Chat Agent
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={isLoading || messages.length === 0}
          >
            Clear Chat
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {messages.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-lg font-medium">Welcome to Spur Support!</p>
                <p className="text-sm mt-2">
                  How can I help you today? Ask me about shipping, returns, or any other questions.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </Card>
  );
}
