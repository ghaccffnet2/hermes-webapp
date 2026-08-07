"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Clock, BarChart3, Activity, CheckCircle2, MessageCircle, AlertTriangle, Send, Terminal, Upload } from "lucide-react";

const stats = [
  { label: "Active Sessions", value: "3", icon: MessageSquare, color: "text-primary" },
  { label: "Cron Jobs", value: "2 active", icon: Clock, color: "text-green-500" },
  { label: "API Calls Today", value: "147", icon: BarChart3, color: "text-yellow-500" },
  { label: "Uptime", value: "99.8%", icon: Activity, color: "text-green-500" },
];

const activity = [
  { text: 'Cron job "hermes-daily-backup" completed successfully', time: "3 hours ago", type: "success" as const },
  { text: "New session started: Telegram WebApp Dashboard", time: "4 hours ago", type: "info" as const },
  { text: "Service Gmail reconnected after timeout", time: "5 hours ago", type: "warning" as const },
  { text: "User Muhammad Farzaneh updated settings", time: "8 hours ago", type: "info" as const },
  { text: "Backup created: hermes-backup-2026-08-07.tar.gz", time: "12 hours ago", type: "success" as const },
];

const activityIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size={14} className="text-green-500" />,
  info: <MessageCircle size={14} className="text-primary" />,
  warning: <AlertTriangle size={14} className="text-yellow-500" />,
};

const activityBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  info: "secondary",
  warning: "outline",
};

export default function DashboardPage() {
  const [backupLoading, setBackupLoading] = useState(false);

  const handleBackup = () => {
    setBackupLoading(true);
    setTimeout(() => setBackupLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your Hermes AI agent</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {activity.map((item, i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center gap-4 hover:bg-accent/50 transition-colors"
              >
                <span className="flex-shrink-0">{activityIcons[item.type]}</span>
                <p className="flex-1 text-sm text-foreground">{item.text}</p>
                <Badge variant={activityBadgeVariant[item.type]} className="text-xs whitespace-nowrap">
                  {item.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Send Message
          </Button>
          <Button variant="outline" className="gap-2">
            <Terminal className="h-4 w-4" />
            Run Command
          </Button>
          <Button
            variant="outline"
            onClick={handleBackup}
            disabled={backupLoading}
            className="gap-2"
          >
            {backupLoading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {backupLoading ? "Backing up..." : "Backup Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
