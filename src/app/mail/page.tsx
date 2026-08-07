"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Inbox, Mail, Star, Plus, Search, Circle } from "lucide-react";

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
    fullContent:
      "PR #427 'feat: add Telegram WebApp integration' has been merged into main.\n\nAuthor: muhammad-farzaneh\nReviewers: hermes-agent\n\nChanges:\n- Added Next.js 14 App Router setup\n- Implemented dark theme with purple accent\n- Created sidebar navigation component\n- Added dashboard with stats cards\n\nMerge commit: a3f2e8b\n\n— GitHub Notifications",
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
    fullContent:
      "Deployment Successful! 🎉\n\nService: hermes-webapp\nDeployment: meticulous-analysis\nStatus: Active\nURL: hermes.nousresearch.com\n\nMetrics:\n- Build time: 42s\n- Memory: 512MB\n- CPU: 0.5 vCPU\n\nYour latest changes are now live in production.\n\n— Railway",
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
    fullContent:
      "Project Deployed Successfully! 🚀\n\nProject: hermes-dashboard\nDomain: hermes-dashboard.vercel.app\nBranch: main\nCommit: feat: add all dashboard pages\n\nPerformance:\n- FCP: 0.8s\n- LCP: 1.2s\n- CLS: 0.01\n\nYour dashboard is now accessible to all users.\n\n— Vercel",
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
    if (
      search &&
      !e.subject.toLowerCase().includes(search.toLowerCase()) &&
      !e.from.toLowerCase().includes(search.toLowerCase())
    )
      return false;
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
    <div className="space-y-6 overflow-x-hidden max-w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mail</h1>
          <p className="text-muted-foreground mt-1">Check your email inbox</p>
        </div>
        <Dialog open={showCompose} onOpenChange={setShowCompose}>
          <DialogTrigger render={<Button className="gap-2" />}>
              <Plus className="h-4 w-4" />
              Compose
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Compose Email</DialogTitle>
              <DialogDescription>Write and send a new email message.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">To</label>
                <Input
                  type="email"
                  value={compose.to}
                  onChange={(e) => setCompose((prev) => ({ ...prev, to: e.target.value }))}
                  placeholder="recipient@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Subject</label>
                <Input
                  type="text"
                  value={compose.subject}
                  onChange={(e) => setCompose((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Email subject"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Body</label>
                <Textarea
                  value={compose.body}
                  onChange={(e) => setCompose((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Write your message..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
              <Button onClick={handleSend}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {([
            { key: "all" as const, icon: <Inbox size={14} />, label: "All" },
            { key: "unread" as const, icon: <Mail size={14} />, label: "Unread" },
            { key: "starred" as const, icon: <Star size={14} />, label: "Starred" },
          ]).map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
              className="gap-1.5"
            >
              {f.icon}
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[60vh]">
            {filtered.map((email) => (
              <div key={email.id} className="border-b border-border last:border-0">
                <div
                  className="px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer flex items-start gap-4"
                  onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback style={{ backgroundColor: email.fromColor }} className="text-white text-xs font-bold">
                      {email.fromInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-semibold ${
                          email.unread ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {email.from}
                      </span>
                      <span className="text-xs text-muted-foreground">{email.date}</span>
                      {email.unread && (
                        <Circle size={8} className="fill-primary text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        email.unread ? "text-foreground font-medium" : "text-muted-foreground"
                      } truncate`}
                    >
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{email.preview}</p>
                  </div>

                  {/* Star */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                  >
                    <Star
                      size={16}
                      className={email.starred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}
                    />
                  </Button>
                </div>

                {/* Expanded content */}
                {expandedId === email.id && (
                  <div className="px-5 py-4 bg-background border-t border-border animate-in slide-in-from-top-2">
                    <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                      {email.fullContent}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">
                <p>No emails found.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
