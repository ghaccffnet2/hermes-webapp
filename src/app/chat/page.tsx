"use client";

import { useState, useRef, useEffect } from "react";

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
    content: "I'll help you build a complete Telegram WebApp dashboard! Let me create the project structure with Next.js, Tailwind CSS, and all the necessary components.\n\nHere's what I'll set up:\n\n1. **Project structure** with App Router\n2. **Dark theme** with purple accent (#6c5ce7)\n3. **Sidebar navigation** with all sections\n4. **Dashboard** with stats and activity\n5. **Full chat interface**\n6. And more pages...\n\nLet me start building this!",
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
    content: "Absolutely! I'll add a comprehensive services page with:\n\n- Service cards grid layout\n- Status indicators (connected/disconnected)\n- Quick action buttons\n- Verification timestamps\n\n```typescript\nconst services = [\n  { name: 'Gmail', status: 'connected', icon: '📧' },\n  { name: 'GitHub', status: 'connected', icon: '🐙' },\n  { name: 'Railway', status: 'connected', icon: '🚂' },\n];\n```\n\nThe page will be fully functional with mock data and smooth interactions!",
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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
        content: "I've processed your request. The changes have been applied successfully. Here's a summary of what was done:\n\n- Updated the configuration file\n- Ran the necessary checks\n- Deployed the changes\n\nEverything looks good! Let me know if you need anything else.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 md:-m-8">
      {/* Session Header */}
      <div className="bg-[#12121a] border-b border-[#1e1e2e] px-4 py-3 flex items-center gap-4">
        <div className="relative">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e2e] text-[#e4e4e7] text-sm rounded-lg px-3 py-2 pr-8 appearance-none cursor-pointer hover:border-[#6c5ce7] transition-colors focus:outline-none focus:border-[#6c5ce7]"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <svg className="w-4 h-4 text-[#71717a] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          Mimo-hermes
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#6c5ce7] text-white rounded-br-md"
                  : "bg-[#12121a] border border-[#1e1e2e] text-[#e4e4e7] rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="text-sm whitespace-pre-wrap">
                  {msg.content.split("```").map((part, i) => {
                    if (i % 2 === 1) {
                      return (
                        <pre key={i} className="bg-[#0a0a0f] rounded-lg p-3 my-2 overflow-x-auto">
                          <code className="text-xs text-[#e4e4e7]">{part}</code>
                        </pre>
                      );
                    }
                    return (
                      <span key={i}>
                        {part.split("\n").map((line, j) => {
                          if (line.startsWith("- ")) {
                            return (
                              <div key={j} className="flex gap-2 my-0.5">
                                <span className="text-[#6c5ce7]">•</span>
                                <span>{line.slice(2)}</span>
                              </div>
                            );
                          }
                          if (line.match(/^\d+\./)) {
                            return (
                              <div key={j} className="my-0.5">
                                <span className="text-[#6c5ce7] font-semibold">{line.match(/^\d+\./)?.[0]} </span>
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
              <p className={`text-xs mt-2 ${msg.role === "user" ? "text-white/60" : "text-[#71717a]"}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Tool call indicator */}
        {toolRunning && (
          <div className="flex justify-start">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#6c5ce7] border-t-transparent rounded-full spin-slow" />
              <span className="text-sm text-[#71717a]">{toolRunning}</span>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#6c5ce7] pulse-soft" />
                <div className="w-2 h-2 rounded-full bg-[#6c5ce7] pulse-soft" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-[#6c5ce7] pulse-soft" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#12121a] border-t border-[#1e1e2e] px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#71717a] hover:text-[#e4e4e7] transition-colors rounded-lg hover:bg-[#1a1a25]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-2.5 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-[#6c5ce7] hover:bg-[#7c6cf7] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
