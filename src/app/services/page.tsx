"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, GitBranch, Train, Calendar, FileText, Bot, CheckCircle, RefreshCw, Unplug } from "lucide-react";
import type { ReactNode } from "react";

interface Service {
  id: string;
  name: string;
  icon: ReactNode;
  status: "connected" | "disconnected";
  lastVerified: string;
}

const initialServices: Service[] = [
  { id: "gmail", name: "Gmail", icon: <Mail size={24} />, status: "connected", lastVerified: "2h ago" },
  { id: "github", name: "GitHub", icon: <GitBranch size={24} />, status: "connected", lastVerified: "30m ago" },
  { id: "railway", name: "Railway", icon: <Train size={24} />, status: "connected", lastVerified: "5m ago" },
  { id: "calendar", name: "Google Calendar", icon: <Calendar size={24} />, status: "disconnected", lastVerified: "2d ago" },
  { id: "obsidian", name: "Obsidian", icon: <FileText size={24} />, status: "connected", lastVerified: "1h ago" },
  { id: "userbot", name: "Telegram Userbot", icon: <Bot size={24} />, status: "connected", lastVerified: "15m ago" },
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
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground mt-1">Manage connected services and integrations</p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <Card className="px-4 py-3">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="text-xl font-bold text-green-500">
              {services.filter((s) => s.status === "connected").length}
            </p>
          </CardContent>
        </Card>
        <Card className="px-4 py-3">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">Disconnected</p>
            <p className="text-xl font-bold text-red-500">
              {services.filter((s) => s.status === "disconnected").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:bg-accent/50 transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-foreground">{service.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last verified: {service.lastVerified}
                    </p>
                  </div>
                </div>
                <Badge variant={service.status === "connected" ? "default" : "destructive"}>
                  {service.status === "connected" ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerify(service.id)}
                  disabled={verifying === service.id}
                  className="gap-1.5"
                >
                  {verifying === service.id ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  Verify
                </Button>
                <Button
                  variant={service.status === "connected" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggle(service.id)}
                  className="gap-1.5"
                >
                  <Unplug className="h-3 w-3" />
                  {service.status === "connected" ? "Disconnect" : "Reconnect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
