"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Paperclip, ArrowUp } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCall?: string;
}

const sessions = [
  { id: "1", name: "Telegram WebApp Dashboard" },
  { id: "2", name: "Morning briefing" },
  { id: "3", name: "Code review session" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Can you help me build a Telegram WebApp dashboard for Hermes?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "I'll help you build a complete Telegram WebApp dashboard! Let me create the project structure with Next.js, Tailwind CSS, and all the necessary components.\n\nHere's what I'll set up:\n\n1. **Project structure** with App Router\n2. **Dark theme** with purple accent (#6c5ce7)\n3. **Sidebar navigation** with all sections\n4. **Dashboard** with stats and activity\n5. **Full chat interface**\n6. And more pages...\n\nLet me start building this!",
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    role: "user",
    content: "Great! Can you also add the services page?",
    timestamp: "10:32 AM",
  },
  {
    id: 4,
    role: "assistant",
    content:
      "Absolutely! I'll add a comprehensive services page with:\n\n- Service cards grid layout\n- Status indicators (connected/disconnected)\n- Quick action buttons\n- Verification timestamps\n\n```typescript\nconst services = [\n  { name: 'Gmail', status: 'connected', icon: '📧' },\n  { name: 'GitHub', status: 'connected', icon: '🐙' },\n  { name: 'Railway', status: 'connected', icon: '🚂' },\n];\n```\n\nThe page will be fully functional with mock data and smooth interactions!",
    timestamp: "10:33 AM",
  },
];

export default function ChatPage() {
  const [selectedSession, setSelectedSession] = useState(sessions[0].id);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toolRunning, setToolRunning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate tool call
    setToolRunning("Running terminal...");
    setTimeout(() => {
      setToolRunning(null);
      setIsTyping(true);

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I've processed your request. The changes have been applied successfully. Here's a summary of what was done:\n\n- Updated the configuration file\n- Ran the necessary checks\n- Deployed the changes\n\nEverything looks good! Let me know if you need anything else.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] -m-4 md:-m-8 overflow-hidden">
      {/* Session Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <Select value={selectedSession} onValueChange={(v) => { if (v !== null) setSelectedSession(v) }}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select session" />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
          Mimo-hermes
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 overflow-hidden ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.content.split("```").map((part, i) => {
                      if (i % 2 === 1) {
                        return (
                          <pre
                            key={i}
                            className="bg-background rounded-lg p-3 my-2 overflow-x-auto max-w-full"
                          >
                            <code className="text-xs text-foreground break-words whitespace-pre-wrap">
                              {part}
                            </code>
                          </pre>
                        );
                      }
                      return (
                        <span key={i}>
                          {part.split("\n").map((line, j) => {
                            if (line.startsWith("- ")) {
                              return (
                                <div key={j} className="flex gap-2 my-0.5">
                                  <span className="text-primary">•</span>
                                  <span>{line.slice(2)}</span>
                                </div>
                              );
                            }
                            if (line.match(/^\d+\./)) {
                              return (
                                <div key={j} className="my-0.5">
                                  <span className="text-primary font-semibold">
                                    {line.match(/^\d+\./)?.[0]}{" "}
                                  </span>
                                  <span>{line.replace(/^\d+\.\s*/, "")}</span>
                                </div>
                              );
                            }
                            return (
                              <span key={j}>
                                {line.replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
                                {j < part.split("\n").length - 1 && "\n"}
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p
                  className={`text-xs mt-2 ${
                    msg.role === "user" ? "text-white/60" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {/* Tool call indicator */}
          {toolRunning && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">{toolRunning}</span>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="bg-card border-t border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="pr-10"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="rounded-xl"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
