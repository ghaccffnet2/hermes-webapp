"use client";

import { useState } from "react";

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
  const [newUser, setNewUser] = useState({ id: "", name: "", role: "user" as "admin" | "user" | "readonly" });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e4e4e7]">Users</h1>
          <p className="text-[#71717a] mt-1">Manage bot access and permissions</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAdd && (
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4 slide-in">
          <h3 className="font-semibold text-[#e4e4e7]">Add User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">User ID</label>
              <input
                type="text"
                value={newUser.id}
                onChange={(e) => setNewUser((prev) => ({ ...prev, id: e.target.value }))}
                placeholder="123456789"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as "admin" | "user" | "readonly" }))}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="readonly">Read-only</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add User
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-[#0a0a0f] border border-[#1e1e2e] text-[#71717a] text-sm font-medium rounded-lg hover:text-[#e4e4e7] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Make Bot Public Toggle */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#e4e4e7]">Make Bot Public</h3>
          <p className="text-sm text-[#71717a] mt-0.5">
            Allow anyone to interact with the bot. Be cautious with this setting.
          </p>
        </div>
        <button
          onClick={() => setIsPublic(!isPublic)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isPublic ? "bg-[#22c55e]" : "bg-[#71717a]"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              isPublic ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {isPublic && (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#f59e0b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-[#f59e0b]">
            Warning: Making the bot public means anyone can send messages and use resources. This may increase API costs.
          </p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-3 bg-[#0a0a0f] border-b border-[#1e1e2e] text-xs font-medium text-[#71717a] uppercase tracking-wider">
          <div>User ID</div>
          <div>Name</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 border-b border-[#1e1e2e] last:border-0 hover:bg-[#1a1a25] transition-colors items-center"
          >
            <div className="text-sm font-mono text-[#71717a]">{user.id}</div>
            <div className="text-sm font-medium text-[#e4e4e7]">{user.name}</div>
            <div>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  user.role === "admin"
                    ? "bg-[#6c5ce7]/10 text-[#6c5ce7]"
                    : user.role === "user"
                    ? "bg-[#22c55e]/10 text-[#22c55e]"
                    : "bg-[#71717a]/10 text-[#71717a]"
                }`}
              >
                {user.role}
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    user.status === "active" ? "bg-[#22c55e]" : "bg-[#ef4444]"
                  }`}
                />
                <span className={user.status === "active" ? "text-[#22c55e]" : "text-[#ef4444]"}>
                  {user.status}
                </span>
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => toggleStatus(user.id)}
                className="px-2 py-1 text-xs bg-[#0a0a0f] text-[#71717a] rounded hover:text-[#e4e4e7] transition-colors"
              >
                {user.status === "active" ? "Block" : "Unblock"}
              </button>
              <button
                onClick={() => removeUser(user.id)}
                className="px-2 py-1 text-xs bg-[#ef4444]/10 text-[#ef4444] rounded hover:bg-[#ef4444]/20 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Requests */}
      <div>
        <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4">Pending Requests</h2>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl divide-y divide-[#1e1e2e]">
          {pendingRequests.map((req) => (
            <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#1a1a25] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center text-[#6c5ce7] text-sm font-semibold">
                  {req.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e4e4e7]">{req.name}</p>
                  <p className="text-xs text-[#71717a]">ID: {req.id} · Requested {req.requestedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setUsers((prev) => [...prev, { id: req.id, name: req.name, role: "user", status: "active" }]);
                    pendingRequests.splice(pendingRequests.indexOf(req), 1);
                  }}
                  className="px-3 py-1 text-xs bg-[#22c55e]/10 text-[#22c55e] rounded hover:bg-[#22c55e]/20 transition-colors"
                >
                  Approve
                </button>
                <button className="px-3 py-1 text-xs bg-[#ef4444]/10 text-[#ef4444] rounded hover:bg-[#ef4444]/20 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
