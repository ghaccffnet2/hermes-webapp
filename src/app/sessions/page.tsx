"use client";

import { useState } from "react";

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
      { role: "assistant", content: "I'll help you build a complete Telegram WebApp dashboard! Let me create the project structure with Next.js, Tailwind CSS, and all the necessary components.", time: "10:31 AM" },
      { role: "user", content: "Great! Can you also add the services page?", time: "10:32 AM" },
      { role: "assistant", content: "Absolutely! I'll add a comprehensive services page with service cards grid layout, status indicators, and quick action buttons.", time: "10:33 AM" },
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
      { role: "assistant", content: "Good morning! Here's your daily summary:\n\n📧 5 new emails\n🐙 3 new PRs to review\n🚂 1 successful deploy\n⏰ 2 cron jobs running\n\nHave a productive day!", time: "8:01 AM" },
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
      { role: "assistant", content: "I've reviewed PR #427. The code looks solid overall. Here are my findings:\n\n✅ Good error handling\n✅ Clean component structure\n⚠️ Minor: Consider memoizing the sidebar component\n⚠️ The debounce on the search input could be moved to a custom hook\n\nVerdict: Approve with suggestions.", time: "Yesterday 3:05 PM" },
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
      { role: "assistant", content: "I've configured daily backups at midnight UTC. The backup includes:\n\n- Config files\n- Memories database\n- Skills directory\n- Session data\n\nBackup location: /backups/hermes/", time: "2 days ago" },
    ],
  },
];

const platformIcons: Record<string, { icon: string; color: string }> = {
  telegram: { icon: "✈️", color: "#6c5ce7" },
  discord: { icon: "🎮", color: "#5865F2" },
  cli: { icon: "💻", color: "#22c55e" },
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
        <h1 className="text-2xl font-bold text-[#e4e4e7]">Sessions</h1>
        <p className="text-[#71717a] mt-1">Browse and review conversation sessions</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "telegram", "discord", "cli"].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                platformFilter === p
                  ? "bg-[#6c5ce7]/10 text-[#6c5ce7] border border-[#6c5ce7]/30"
                  : "bg-[#12121a] border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]"
              }`}
            >
              {p === "all" ? "All" : platformIcons[p]?.icon + " " + p}
            </button>
          ))}
        </div>
      </div>

      {/* Session Detail View */}
      {selected ? (
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden slide-in">
          <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSession(null)}
                className="text-[#71717a] hover:text-[#e4e4e7] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-lg">{platformIcons[selected.platform]?.icon}</span>
              <h3 className="font-semibold text-[#e4e4e7]">{selected.title}</h3>
              <span className="text-xs text-[#71717a]">{selected.messageCount} messages</span>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {selected.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#6c5ce7] text-white rounded-br-md"
                      : "bg-[#0a0a0f] border border-[#1e1e2e] text-[#e4e4e7] rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === "user" ? "text-white/60" : "text-[#71717a]"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Session Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((session) => {
            const platform = platformIcons[session.platform];
            return (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session.id)}
                className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:bg-[#1a1a25] transition-all duration-200 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{platform?.icon}</span>
                    <h3 className="font-semibold text-[#e4e4e7] text-sm">{session.title}</h3>
                  </div>
                  <span className="text-xs text-[#71717a]">{session.timestamp}</span>
                </div>
                <p className="text-xs text-[#71717a] line-clamp-2 mb-3">{session.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#71717a]">
                    {session.messageCount} messages
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs rounded capitalize"
                    style={{ backgroundColor: platform?.color + "20", color: platform?.color }}
                  >
                    {session.platform}
                  </span>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 px-6 py-12 text-center text-[#71717a]">
              No sessions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
