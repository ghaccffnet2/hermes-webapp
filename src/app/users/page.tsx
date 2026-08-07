"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: "admin" | "user" | "readonly";
  status: "active" | "blocked";
}

const initialUsers: User[] = [
  { id: "1059494749", name: "Muhammad Farzaneh", role: "admin", status: "active" },
];

const pendingRequests = [
  { id: "9876543210", name: "Alex Johnson", requestedAt: "2 hours ago" },
  { id: "1122334455", name: "Sara Chen", requestedAt: "1 day ago" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    role: "user" as "admin" | "user" | "readonly",
  });
  const [isPublic, setIsPublic] = useState(false);

  const handleAdd = () => {
    if (!newUser.id || !newUser.name) return;
    setUsers((prev) => [
      ...prev,
      { id: newUser.id, name: newUser.name, role: newUser.role, status: "active" as const },
    ]);
    setNewUser({ id: "", name: "", role: "user" });
    setShowAdd(false);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const roleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "admin":
        return "default";
      case "user":
        return "secondary";
      case "readonly":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage bot access and permissions</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger render={<Button className="gap-2 whitespace-nowrap" />}>
              <Plus className="h-4 w-4" />
              Add User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Add a new user to the bot with their Telegram ID.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">User ID</label>
                <Input
                  type="text"
                  value={newUser.id}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, id: e.target.value }))}
                  placeholder="123456789"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Role</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => {
                    if (value !== null)
                      setNewUser((prev) => ({
                        ...prev,
                        role: value as "admin" | "user" | "readonly",
                      }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="readonly">Read-only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Make Bot Public Toggle */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Make Bot Public</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Allow anyone to interact with the bot. Be cautious with this setting.
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </CardContent>
      </Card>

      {isPublic && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-500">
            Warning: Making the bot public means anyone can send messages and use resources. This may increase API costs.
          </p>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>User ID</div>
            <div>Name</div>
            <div>Role</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors items-center"
            >
              <div className="text-sm font-mono text-muted-foreground">{user.id}</div>
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div>
                <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
              </div>
              <div>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(user.id)}>
                  {user.status === "active" ? "Block" : "Unblock"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUser(user.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pending Requests</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                      {req.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {req.id} · Requested {req.requestedAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setUsers((prev) => [
                        ...prev,
                        { id: req.id, name: req.name, role: "user", status: "active" },
                      ]);
                    }}
                  >
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
