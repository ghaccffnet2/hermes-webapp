"use client";

import { useState } from "react";

const stats = [
  { label: "Active Sessions", value: "3", icon: "💬", color: "#6c5ce7" },
  { label: "Cron Jobs", value: "2 active", icon: "⏰", color: "#22c55e" },
  { label: "API Calls Today", value: "147", icon: "📊", color: "#f59e0b" },
  { label: "Uptime", value: "99.8%", icon: "🟢", color: "#22c55e" },
];

const activity = [
  { text: "Cron job \"hermes-daily-backup\" completed successfully", time: "3 hours ago", type: "success" },
  { text: "New session started: Telegram WebApp Dashboard", time: "4 hours ago", type: "info" },
  { text: "Service Gmail reconnected after timeout", time: "5 hours ago", type: "warning" },
  { text: "User Muhammad Farzaneh updated settings", time: "8 hours ago", type: "info" },
  { text: "Backup created: hermes-backup-2026-08-07.tar.gz", time: "12 hours ago", type: "success" },
];

const activityColors: Record<string, string> = {
  success: "#22c55e",
  info: "#6c5ce7",
  warning: "#f59e0b",
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
        <h1 className="text-2xl font-bold text-[#e4e4e7]">Dashboard</h1>
        <p className="text-[#71717a] mt-1">Overview of your Hermes AI agent</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:bg-[#1a1a25] transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div
                className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: stat.color }}
              />
            </div>
            <p className="text-2xl font-bold text-[#e4e4e7]">{stat.value}</p>
            <p className="text-sm text-[#71717a] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl">
        <div className="px-6 py-4 border-b border-[#1e1e2e]">
          <h2 className="text-lg font-semibold text-[#e4e4e7]">Recent Activity</h2>
        </div>
        <div className="divide-y divide-[#1e1e2e]">
          {activity.map((item, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center gap-4 hover:bg-[#1a1a25] transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: activityColors[item.type] }}
              />
              <p className="flex-1 text-sm text-[#e4e4e7]">{item.text}</p>
              <span className="text-xs text-[#71717a] whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Message
          </button>
          <button className="px-5 py-2.5 bg-[#12121a] border border-[#1e1e2e] hover:bg-[#1a1a25] text-[#e4e4e7] text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Run Command
          </button>
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            className="px-5 py-2.5 bg-[#12121a] border border-[#1e1e2e] hover:bg-[#1a1a25] text-[#e4e4e7] text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {backupLoading ? (
              <div className="w-4 h-4 border-2 border-[#6c5ce7] border-t-transparent rounded-full spin-slow" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            {backupLoading ? "Backing up..." : "Backup Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
