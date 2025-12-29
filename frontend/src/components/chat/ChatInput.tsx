import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_MESSAGE_LENGTH = 500;
const SHOW_COUNT_THRESHOLD = 400;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const trimmedLength = input.trim().length;
  const isOverLimit = trimmedLength > MAX_MESSAGE_LENGTH;
  const showCharCount = trimmedLength >= SHOW_COUNT_THRESHOLD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isOverLimit) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t">
      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={disabled || !input.trim() || isOverLimit}
        >
          Send
        </Button>
      </form>
      {showCharCount && (
        <div
          className={`px-4 pb-2 text-xs ${
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {trimmedLength}/{MAX_MESSAGE_LENGTH} characters
          {isOverLimit && " (message too long)"}
        </div>
      )}
    </div>
  );
}
