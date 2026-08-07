"use client";

import { useState } from "react";

interface Service {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "disconnected";
  lastVerified: string;
}

const initialServices: Service[] = [
  { id: "gmail", name: "Gmail", icon: "📧", status: "connected", lastVerified: "2h ago" },
  { id: "github", name: "GitHub", icon: "🐙", status: "connected", lastVerified: "30m ago" },
  { id: "railway", name: "Railway", icon: "🚂", status: "connected", lastVerified: "5m ago" },
  { id: "calendar", name: "Google Calendar", icon: "📅", status: "disconnected", lastVerified: "2d ago" },
  { id: "obsidian", name: "Obsidian", icon: "📝", status: "connected", lastVerified: "1h ago" },
  { id: "userbot", name: "Telegram Userbot", icon: "🤖", status: "connected", lastVerified: "15m ago" },
];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "connected" as const, lastVerified: "just now" } : s
        )
      );
      setVerifying(null);
    }, 1500);
  };

  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "connected" ? ("disconnected" as const) : ("connected" as const),
              lastVerified: s.status === "disconnected" ? "just now" : s.lastVerified,
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#e4e4e7]">Services</h1>
        <p className="text-[#71717a] mt-1">Manage connected services and integrations</p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3">
          <p className="text-sm text-[#71717a]">Connected</p>
          <p className="text-xl font-bold text-[#22c55e]">
            {services.filter((s) => s.status === "connected").length}
          </p>
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3">
          <p className="text-sm text-[#71717a]">Disconnected</p>
          <p className="text-xl font-bold text-[#ef4444]">
            {services.filter((s) => s.status === "disconnected").length}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:bg-[#1a1a25] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#e4e4e7]">{service.name}</h3>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    Last verified: {service.lastVerified}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  service.status === "connected"
                    ? "bg-[#22c55e]/10 text-[#22c55e]"
                    : "bg-[#ef4444]/10 text-[#ef4444]"
                }`}
              >
                {service.status === "connected" ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleVerify(service.id)}
                disabled={verifying === service.id}
                className="px-3 py-1.5 text-xs font-medium bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-[#e4e4e7] hover:border-[#6c5ce7] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {verifying === service.id ? (
                  <div className="w-3 h-3 border border-[#6c5ce7] border-t-transparent rounded-full spin-slow" />
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Verify
              </button>
              <button
                onClick={() => handleToggle(service.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  service.status === "connected"
                    ? "bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20"
                    : "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                }`}
              >
                {service.status === "connected" ? "Disconnect" : "Reconnect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
