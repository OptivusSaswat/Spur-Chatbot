import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Agent is typing</span>
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
        </span>
      </div>
    </div>
  );
}
