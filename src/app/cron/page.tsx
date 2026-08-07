"use client";

import { useState } from "react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  prompt: string;
  lastRun: string;
  nextRun: string;
  status: "running" | "paused";
  targetChat: string;
}

const initialJobs: CronJob[] = [
  {
    id: "1",
    name: "hermes-daily-backup",
    schedule: "0 0 * * *",
    prompt: "Create a full backup of the Hermes agent configuration, memories, and session data.",
    lastRun: "3h ago",
    nextRun: "21h",
    status: "running",
    targetChat: "Telegram",
  },
  {
    id: "2",
    name: "thezoomit-monitor",
    schedule: "*/30 * * * *",
    prompt: "Monitor thezoomit.com for new content and report any changes.",
    lastRun: "5m ago",
    nextRun: "25m",
    status: "running",
    targetChat: "Telegram",
  },
];

const schedulePresets = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 2 hours", value: "0 */2 * * *" },
  { label: "Every 30 minutes", value: "*/30 * * * *" },
  { label: "Daily at 9am", value: "0 9 * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekly on Monday", value: "0 9 * * 1" },
];

export default function CronPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [showCreate, setShowCreate] = useState(false);
  const [newJob, setNewJob] = useState({
    name: "",
    prompt: "",
    schedule: "",
    targetChat: "Telegram",
  });

  const handleCreate = () => {
    if (!newJob.name || !newJob.prompt || !newJob.schedule) return;
    const job: CronJob = {
      id: String(Date.now()),
      name: newJob.name,
      schedule: newJob.schedule,
      prompt: newJob.prompt,
      lastRun: "never",
      nextRun: "pending",
      status: "running",
      targetChat: newJob.targetChat,
    };
    setJobs((prev) => [...prev, job]);
    setNewJob({ name: "", prompt: "", schedule: "", targetChat: "Telegram" });
    setShowCreate(false);
  };

  const toggleJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: j.status === "running" ? "paused" : "running" } : j
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e4e4e7]">Cron Jobs</h1>
          <p className="text-[#71717a] mt-1">Schedule and manage automated tasks</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Job
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4 slide-in">
          <h3 className="font-semibold text-[#e4e4e7]">New Cron Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Name</label>
              <input
                type="text"
                value={newJob.name}
                onChange={(e) => setNewJob((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="my-cron-job"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Target Chat</label>
              <select
                value={newJob.targetChat}
                onChange={(e) => setNewJob((prev) => ({ ...prev, targetChat: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              >
                <option value="Telegram">Telegram</option>
                <option value="Discord">Discord</option>
                <option value="CLI">CLI</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#71717a] mb-1.5">Prompt</label>
            <textarea
              value={newJob.prompt}
              onChange={(e) => setNewJob((prev) => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe what this cron job should do..."
              rows={3}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#71717a] mb-1.5">Schedule</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {schedulePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setNewJob((prev) => ({ ...prev, schedule: preset.value }))}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                    newJob.schedule === preset.value
                      ? "bg-[#6c5ce7]/10 border-[#6c5ce7] text-[#6c5ce7]"
                      : "bg-[#0a0a0f] border-[#1e1e2e] text-[#71717a] hover:border-[#6c5ce7]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newJob.schedule}
              onChange={(e) => setNewJob((prev) => ({ ...prev, schedule: e.target.value }))}
              placeholder="* * * * *"
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors font-mono"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create Job
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] text-[#71717a] text-sm font-medium rounded-lg hover:text-[#e4e4e7] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-[#0a0a0f] border-b border-[#1e1e2e] text-xs font-medium text-[#71717a] uppercase tracking-wider">
          <div className="col-span-2">Name</div>
          <div>Schedule</div>
          <div>Last Run</div>
          <div>Next Run</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 px-6 py-4 border-b border-[#1e1e2e] last:border-0 hover:bg-[#1a1a25] transition-colors items-center"
          >
            <div className="col-span-2">
              <p className="font-medium text-[#e4e4e7] text-sm">{job.name}</p>
              <p className="text-xs text-[#71717a] truncate mt-0.5">{job.prompt}</p>
            </div>
            <div className="text-sm text-[#71717a] font-mono">{job.schedule}</div>
            <div className="text-sm text-[#71717a]">{job.lastRun}</div>
            <div className="text-sm text-[#71717a]">{job.nextRun}</div>
            <div>
              <span className="flex items-center gap-1.5 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    job.status === "running" ? "bg-[#22c55e]" : "bg-[#71717a]"
                  }`}
                />
                <span className={job.status === "running" ? "text-[#22c55e]" : "text-[#71717a]"}>
                  {job.status === "running" ? "Running" : "Paused"}
                </span>
              </span>
            </div>
            <div className="flex gap-1.5">
              <button className="px-2 py-1 text-xs bg-[#6c5ce7]/10 text-[#6c5ce7] rounded hover:bg-[#6c5ce7]/20 transition-colors">
                Run
              </button>
              <button
                onClick={() => toggleJob(job.id)}
                className="px-2 py-1 text-xs bg-[#0a0a0f] text-[#71717a] rounded hover:text-[#e4e4e7] transition-colors"
              >
                {job.status === "running" ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => deleteJob(job.id)}
                className="px-2 py-1 text-xs bg-[#ef4444]/10 text-[#ef4444] rounded hover:bg-[#ef4444]/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="px-6 py-12 text-center text-[#71717a]">
            <p>No cron jobs configured yet.</p>
            <p className="text-sm mt-1">Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
