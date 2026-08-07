"use client";

import { useState } from "react";
import { Inbox, Mail, Star, Circle } from "lucide-react";

interface Email {
  id: string;
  from: string;
  fromInitials: string;
  fromColor: string;
  subject: string;
  preview: string;
  fullContent: string;
  date: string;
  unread: boolean;
  starred: boolean;
}

const initialEmails: Email[] = [
  {
    id: "1",
    from: "GitHub",
    fromInitials: "GH",
    fromColor: "#8b5cf6",
    subject: "[hermes-agent] New PR #427 merged",
    preview: "PR #427 'feat: add Telegram WebApp integration' has been merged into main.",
    fullContent: "PR #427 'feat: add Telegram WebApp integration' has been merged into main.\n\nAuthor: muhammad-farzaneh\nReviewers: hermes-agent\n\nChanges:\n- Added Next.js 14 App Router setup\n- Implemented dark theme with purple accent\n- Created sidebar navigation component\n- Added dashboard with stats cards\n\nMerge commit: a3f2e8b\n\n— GitHub Notifications",
    date: "2h ago",
    unread: true,
    starred: false,
  },
  {
    id: "2",
    from: "Railway",
    fromInitials: "RW",
    fromColor: "#22c55e",
    subject: "Deploy successful: meticulous-analysis",
    preview: "Your deployment 'meticulous-analysis' is live at hermes.nousresearch.com",
    fullContent: "Deployment Successful! 🎉\n\nService: hermes-webapp\nDeployment: meticulous-analysis\nStatus: Active\nURL: hermes.nousresearch.com\n\nMetrics:\n- Build time: 42s\n- Memory: 512MB\n- CPU: 0.5 vCPU\n\nYour latest changes are now live in production.\n\n— Railway",
    date: "5h ago",
    unread: false,
    starred: true,
  },
  {
    id: "3",
    from: "Vercel",
    fromInitials: "V",
    fromColor: "#e4e4e7",
    subject: "Your project is live",
    preview: "Congratulations! Your Next.js project has been deployed successfully.",
    fullContent: "Project Deployed Successfully! 🚀\n\nProject: hermes-dashboard\nDomain: hermes-dashboard.vercel.app\nBranch: main\nCommit: feat: add all dashboard pages\n\nPerformance:\n- FCP: 0.8s\n- LCP: 1.2s\n- CLS: 0.01\n\nYour dashboard is now accessible to all users.\n\n— Vercel",
    date: "1d ago",
    unread: false,
    starred: false,
  },
];

export default function MailPage() {
  const [emails, setEmails] = useState(initialEmails);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

  const filtered = emails.filter((e) => {
    if (filter === "unread" && !e.unread) return false;
    if (filter === "starred" && !e.starred) return false;
    if (search && !e.subject.toLowerCase().includes(search.toLowerCase()) && !e.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStar = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  };

  const handleSend = () => {
    if (!compose.to || !compose.subject) return;
    setShowCompose(false);
    setCompose({ to: "", subject: "", body: "" });
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e4e4e7]">Mail</h1>
          <p className="text-[#71717a] mt-1">Check your email inbox</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose
        </button>
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
            placeholder="Search emails..."
            className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {([
            { key: "all" as const, icon: <Inbox size={14} /> },
            { key: "unread" as const, icon: <Mail size={14} /> },
            { key: "starred" as const, icon: <Star size={14} /> },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                filter === f.key
                  ? "bg-[#6c5ce7]/10 text-[#6c5ce7] border border-[#6c5ce7]/30"
                  : "bg-[#12121a] border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]"
              } flex items-center gap-1.5`}
            >
              {f.icon}
              {f.key}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        {filtered.map((email) => (
          <div key={email.id} className="border-b border-[#1e1e2e] last:border-0">
            <div
              className="px-5 py-4 hover:bg-[#1a1a25] transition-colors cursor-pointer flex items-start gap-4"
              onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: email.fromColor }}
              >
                {email.fromInitials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${email.unread ? "text-[#e4e4e7]" : "text-[#71717a]"}`}>
                    {email.from}
                  </span>
                  <span className="text-xs text-[#71717a]">{email.date}</span>
                  {email.unread && (
                    <Circle size={8} className="fill-[#6c5ce7] text-[#6c5ce7] flex-shrink-0" />
                  )}
                </div>
                <p className={`text-sm ${email.unread ? "text-[#e4e4e7] font-medium" : "text-[#71717a]"} truncate`}>
                  {email.subject}
                </p>
                <p className="text-xs text-[#71717a] mt-1 truncate">{email.preview}</p>
              </div>

              {/* Star */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id);
                }}
                className={`p-1 transition-colors ${
                  email.starred ? "text-[#f59e0b]" : "text-[#71717a] hover:text-[#f59e0b]"
                }`}
              >
                <svg className="w-4 h-4" fill={email.starred ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>

            {/* Expanded content */}
            {expandedId === email.id && (
              <div className="px-5 py-4 bg-[#0a0a0f] border-t border-[#1e1e2e] slide-in">
                <div className="whitespace-pre-wrap text-sm text-[#e4e4e7] leading-relaxed">
                  {email.fullContent}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[#71717a]">
            <p>No emails found.</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl w-full max-w-lg p-6 space-y-4 slide-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#e4e4e7]">Compose Email</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-[#71717a] hover:text-[#e4e4e7] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">To</label>
              <input
                type="email"
                value={compose.to}
                onChange={(e) => setCompose((prev) => ({ ...prev, to: e.target.value }))}
                placeholder="recipient@email.com"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Subject</label>
              <input
                type="text"
                value={compose.subject}
                onChange={(e) => setCompose((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Body</label>
              <textarea
                value={compose.body}
                onChange={(e) => setCompose((prev) => ({ ...prev, body: e.target.value }))}
                placeholder="Write your message..."
                rows={6}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Send
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 bg-[#0a0a0f] border border-[#1e1e2e] text-[#71717a] text-sm font-medium rounded-lg hover:text-[#e4e4e7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
