"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Gamepad2, Terminal, Search, ChevronLeft, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

interface Session {
  id: string;
  title: string;
  platform: "telegram" | "discord" | "cli";
  messageCount: number;
  lastMessage: string;
  timestamp: string;
  messages: { role: "user" | "assistant"; content: string; time: string }[];
}

const sessions: Session[] = [
  {
    id: "1",
    title: "Telegram WebApp Dashboard",
    platform: "telegram",
    messageCount: 24,
    lastMessage: "Create all the pages with full functionality...",
    timestamp: "2 min ago",
    messages: [
      { role: "user", content: "Can you help me build a Telegram WebApp dashboard?", time: "10:30 AM" },
      {
        role: "assistant",
        content:
          "I'll help you build a complete Telegram WebApp dashboard! Let me create the project structure with Next.js, Tailwind CSS, and all the necessary components.",
        time: "10:31 AM",
      },
      { role: "user", content: "Great! Can you also add the services page?", time: "10:32 AM" },
      {
        role: "assistant",
        content:
          "Absolutely! I'll add a comprehensive services page with service cards grid layout, status indicators, and quick action buttons.",
        time: "10:33 AM",
      },
      { role: "user", content: "Create all the pages with full functionality and mock data", time: "10:35 AM" },
    ],
  },
  {
    id: "2",
    title: "Morning briefing",
    platform: "telegram",
    messageCount: 8,
    lastMessage: "Here's your daily summary with 3 new PRs...",
    timestamp: "6 hours ago",
    messages: [
      { role: "user", content: "Good morning! Give me my daily briefing.", time: "8:00 AM" },
      {
        role: "assistant",
        content:
          "Good morning! Here's your daily summary:\n\n📧 5 new emails\n🐙 3 new PRs to review\n🚂 1 successful deploy\n⏰ 2 cron jobs running\n\nHave a productive day!",
        time: "8:01 AM",
      },
    ],
  },
  {
    id: "3",
    title: "Code review session",
    platform: "discord",
    messageCount: 42,
    lastMessage: "The PR looks good, approved with minor suggestions...",
    timestamp: "1 day ago",
    messages: [
      { role: "user", content: "Review PR #427 on the hermes-agent repo", time: "Yesterday 3:00 PM" },
      {
        role: "assistant",
        content:
          "I've reviewed PR #427. The code looks solid overall. Here are my findings:\n\n✅ Good error handling\n✅ Clean component structure\n⚠️ Minor: Consider memoizing the sidebar component\n⚠️ The debounce on the search input could be moved to a custom hook\n\nVerdict: Approve with suggestions.",
        time: "Yesterday 3:05 PM",
      },
    ],
  },
  {
    id: "4",
    title: "Backup configuration",
    platform: "cli",
    messageCount: 12,
    lastMessage: "Backup schedule set to daily at midnight...",
    timestamp: "2 days ago",
    messages: [
      { role: "user", content: "Set up daily backups for my Hermes config", time: "2 days ago" },
      {
        role: "assistant",
        content:
          "I've configured daily backups at midnight UTC. The backup includes:\n\n- Config files\n- Memories database\n- Skills directory\n- Session data\n\nBackup location: /backups/hermes/",
        time: "2 days ago",
      },
    ],
  },
];

const platformIcons: Record<string, { icon: ReactNode; color: string }> = {
  telegram: { icon: <Send size={18} />, color: "#6c5ce7" },
  discord: { icon: <Gamepad2 size={18} />, color: "#5865F2" },
  cli: { icon: <Terminal size={18} />, color: "#22c55e" },
};

export default function SessionsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const filtered = sessions.filter((s) => {
    if (platformFilter !== "all" && s.platform !== platformFilter) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = sessions.find((s) => s.id === selectedSession);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
        <p className="text-muted-foreground mt-1">Browse and review conversation sessions</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "telegram", "discord", "cli"].map((p) => (
            <Button
              key={p}
              variant={platformFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatformFilter(p)}
              className="gap-1.5"
            >
              {p === "all" ? (
                "All"
              ) : (
                <>
                  <span style={{ color: platformIcons[p]?.color }}>
                    {platformIcons[p]?.icon}
                  </span>
                  {p}
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Session Detail View */}
      {selected ? (
        <Card className="animate-in slide-in-from-left-4">
          <CardHeader className="flex flex-row items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedSession(null)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span style={{ color: platformIcons[selected.platform]?.color }}>
              {platformIcons[selected.platform]?.icon}
            </span>
            <div className="flex-1">
              <CardTitle className="text-lg">{selected.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{selected.messageCount} messages</p>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-background border border-border text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === "user" ? "text-white/60" : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        /* Session Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((session) => {
            const platform = platformIcons[session.platform];
            return (
              <Card
                key={session.id}
                className="hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedSession(session.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: platform?.color }}>{platform?.icon}</span>
                      <h3 className="font-semibold text-foreground text-sm">{session.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{session.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {session.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messageCount} messages
                    </span>
                    <Badge
                      variant="secondary"
                      className="capitalize"
                      style={{
                        backgroundColor: platform?.color + "20",
                        color: platform?.color,
                      }}
                    >
                      {session.platform}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 px-6 py-12 text-center text-muted-foreground">
              No sessions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
