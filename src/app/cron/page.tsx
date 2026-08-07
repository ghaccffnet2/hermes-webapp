"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Play, Pause, Trash2, Clock } from "lucide-react";

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
          <h1 className="text-2xl font-bold text-foreground">Cron Jobs</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage automated tasks</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger render={<Button className="gap-2 whitespace-nowrap" />}>
              <Plus className="h-4 w-4" />
              Create New Job
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Cron Job</DialogTitle>
              <DialogDescription>
                Configure a new automated task with a schedule and prompt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={newJob.name}
                  onChange={(e) => setNewJob((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="my-cron-job"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Target Chat</label>
                <Select
                  value={newJob.targetChat}
                  onValueChange={(value) => { if (value !== null) setNewJob((prev) => ({ ...prev, targetChat: value })) }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="Discord">Discord</SelectItem>
                    <SelectItem value="CLI">CLI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Prompt</label>
              <Textarea
                value={newJob.prompt}
                onChange={(e) => setNewJob((prev) => ({ ...prev, prompt: e.target.value }))}
                placeholder="Describe what this cron job should do..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Schedule</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {schedulePresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={newJob.schedule === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewJob((prev) => ({ ...prev, schedule: preset.value }))}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <Input
                type="text"
                value={newJob.schedule}
                onChange={(e) => setNewJob((prev) => ({ ...prev, schedule: e.target.value }))}
                placeholder="* * * * *"
                className="font-mono"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors items-center"
            >
              <div className="col-span-2">
                <p className="font-medium text-foreground text-sm">{job.name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{job.prompt}</p>
              </div>
              <div className="text-sm text-muted-foreground font-mono">{job.schedule}</div>
              <div className="text-sm text-muted-foreground">{job.lastRun}</div>
              <div className="text-sm text-muted-foreground">{job.nextRun}</div>
              <div>
                <Badge variant={job.status === "running" ? "default" : "secondary"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {job.status === "running" ? "Running" : "Paused"}
                </Badge>
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Play className="h-3 w-3" />
                  Run
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleJob(job.id)}
                  className="gap-1"
                >
                  <Pause className="h-3 w-3" />
                  {job.status === "running" ? "Pause" : "Resume"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteJob(job.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <p>No cron jobs configured yet.</p>
              <p className="text-sm mt-1">Create one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
