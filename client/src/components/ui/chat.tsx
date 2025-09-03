import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isCompleted?: boolean;
}

export function Chat({ messages, onSendMessage, isLoading = false, isCompleted = false }: ChatProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isCompleted) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" role="log" aria-live="polite" aria-label="Chat conversation">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-white/80 py-8" role="status" aria-label="Welcome message from AI assistant">
              <p className="text-lg font-medium">Hi! I'm your AI legal assistant. I'll help you create a customized legal document.</p>
              <p className="text-sm mt-2 text-primary">Let's start by telling me about your business.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
              role="group"
              aria-label={`${message.role === "user" ? "Your message" : "AI assistant message"} at ${formatTime(message.timestamp)}`}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
                  message.role === "user"
                    ? "bg-primary text-white rounded-tr-md border border-primary/20"
                    : "bg-white/90 text-primary rounded-tl-md border border-primary/20 backdrop-blur-sm"
                )}
                role={message.role === "user" ? "status" : "status"}
                aria-label={`Message from ${message.role === "user" ? "you" : "AI assistant"}`}
              >
                <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
                <span className={cn(
                  "text-xs mt-1 block",
                  message.role === "user" ? "text-white/70" : "text-primary/70"
                )} aria-label={`Sent at ${formatTime(message.timestamp)}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%] border border-primary/20 shadow-md" role="status" aria-live="polite" aria-label="AI assistant is typing a response">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1" aria-hidden="true">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-primary font-medium">AI is typing...</span>
                </div>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-4" role="status" aria-live="polite">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-primary font-medium" aria-label="Information gathering complete">✓ Information gathering complete!</p>
                <p className="text-white/80 text-sm mt-1">You can now generate your document.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {!isCompleted && (
        <div className="border-t border-primary/20 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2" role="form" aria-label="Send message to AI assistant">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 bg-muted/50 border-primary/30 text-white placeholder:text-primary/70 focus:border-primary focus:ring-primary/20"
              aria-label="Type your message to the AI assistant"
              aria-describedby="send-button"
            />
            <Button 
              id="send-button"
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              aria-label={isLoading ? "Sending message, please wait" : "Send message"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
