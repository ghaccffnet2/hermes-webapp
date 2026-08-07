"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  MessageSquare,
  FlaskConical,
  Clock,
  Mail,
  DollarSign,
  Users,
  Boxes,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Services", href: "/services", icon: FlaskConical },
  { name: "Cron Jobs", href: "/cron", icon: Clock },
  { name: "Mail", href: "/mail", icon: Mail },
  { name: "Debts", href: "/debts", icon: DollarSign },
  { name: "Users", href: "/users", icon: Users },
  { name: "Sessions", href: "/sessions", icon: Boxes },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-background border-r border-border z-40 flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Hermes</h1>
              <p className="text-xs text-muted-foreground">AI Agent</p>
            </div>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-3 h-10",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  render={<Link href={item.href} onClick={() => setIsOpen(false)} />}
                >
                    <Icon className="h-5 w-5" />
                    {item.name}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* User info at bottom */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-white text-sm font-semibold">MF</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Muhammad Farzaneh</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
}
