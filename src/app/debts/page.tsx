"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";

interface DebtEntry {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: "owed" | "lent";
}

interface Debtor {
  id: string;
  name: string;
  totalOwed: number;
  totalLent: number;
  currency: string;
  lastTransaction: string;
  entries: DebtEntry[];
}

const initialDebtors: Debtor[] = [
  {
    id: "pardis",
    name: "Pardis",
    totalOwed: 0,
    totalLent: 45,
    currency: "USD",
    lastTransaction: "2 days ago",
    entries: [
      { id: "p1", amount: 25, currency: "USD", description: "Dinner at restaurant", date: "2 days ago", type: "lent" },
      { id: "p2", amount: 20, currency: "USD", description: "Concert tickets", date: "1 week ago", type: "lent" },
    ],
  },
  {
    id: "amir",
    name: "Amir",
    totalOwed: 30,
    totalLent: 0,
    currency: "USD",
    lastTransaction: "5 days ago",
    entries: [
      { id: "a1", amount: 30, currency: "USD", description: "Shared taxi fare", date: "5 days ago", type: "owed" },
    ],
  },
  {
    id: "dad",
    name: "Dad",
    totalOwed: 0,
    totalLent: 200,
    currency: "USD",
    lastTransaction: "1 month ago",
    entries: [
      { id: "d1", amount: 200, currency: "USD", description: "Monthly support", date: "1 month ago", type: "lent" },
    ],
  },
  {
    id: "mom",
    name: "Mom",
    totalOwed: 50,
    totalLent: 0,
    currency: "EUR",
    lastTransaction: "3 days ago",
    entries: [
      { id: "m1", amount: 50, currency: "EUR", description: "Groceries", date: "3 days ago", type: "owed" },
    ],
  },
  {
    id: "omit",
    name: "Omit",
    totalOwed: 0,
    totalLent: 150000,
    currency: "IRR",
    lastTransaction: "1 week ago",
    entries: [
      { id: "o1", amount: 150000, currency: "IRR", description: "Phone repair", date: "1 week ago", type: "lent" },
    ],
  },
];

export default function DebtsPage() {
  const [debtors, setDebtors] = useState(initialDebtors);
  const [selectedDebtor, setSelectedDebtor] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDebt, setNewDebt] = useState({
    userId: "",
    amount: "",
    currency: "USD",
    description: "",
  });

  const totalOwed = debtors.reduce((sum, d) => sum + (d.currency === "USD" ? d.totalOwed : 0), 0);
  const totalLent = debtors.reduce((sum, d) => sum + (d.currency === "USD" ? d.totalLent : 0), 0);
  const netBalance = totalLent - totalOwed;

  const handleAdd = () => {
    if (!newDebt.userId || !newDebt.amount || !newDebt.description) return;
    const entry: DebtEntry = {
      id: String(Date.now()),
      amount: Number(newDebt.amount),
      currency: newDebt.currency,
      description: newDebt.description,
      date: "just now",
      type: "lent",
    };

    setDebtors((prev) => {
      const existing = prev.find((d) => d.id === newDebt.userId);
      if (existing) {
        return prev.map((d) =>
          d.id === newDebt.userId
            ? {
                ...d,
                totalLent: d.totalLent + Number(newDebt.amount),
                lastTransaction: "just now",
                entries: [entry, ...d.entries],
              }
            : d
        );
      }
      return [
        ...prev,
        {
          id: newDebt.userId,
          name: newDebt.userId.charAt(0).toUpperCase() + newDebt.userId.slice(1),
          totalOwed: 0,
          totalLent: Number(newDebt.amount),
          currency: newDebt.currency,
          lastTransaction: "just now",
          entries: [entry],
        },
      ];
    });

    setNewDebt({ userId: "", amount: "", currency: "USD", description: "" });
    setShowAdd(false);
  };

  const deleteEntry = (debtorId: string, entryId: string) => {
    setDebtors((prev) =>
      prev.map((d) =>
        d.id === debtorId
          ? {
              ...d,
              entries: d.entries.filter((e) => e.id !== entryId),
              totalLent: d.entries.filter((e) => e.id !== entryId && e.type === "lent").reduce((s, e) => s + e.amount, 0),
            }
          : d
      )
    );
  };

  const selected = debtors.find((d) => d.id === selectedDebtor);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e4e4e7]">Debts</h1>
          <p className="text-[#71717a] mt-1">Track debts and lending</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Debt
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={16} className="text-[#22c55e]" />
            <p className="text-sm text-[#71717a]">Total Owed to Me</p>
          </div>
          <p className="text-2xl font-bold text-[#22c55e] mt-1">${totalLent.toLocaleString()}</p>
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={16} className="text-[#ef4444]" />
            <p className="text-sm text-[#71717a]">Total I Owe</p>
          </div>
          <p className="text-2xl font-bold text-[#ef4444] mt-1">${totalOwed.toLocaleString()}</p>
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className={netBalance >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"} />
            <p className="text-sm text-[#71717a]">Net Balance</p>
          </div>
          <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
            {netBalance >= 0 ? "+" : ""}${netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* User Detail View */}
      {selected ? (
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden slide-in">
          <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDebtor(null)}
                className="text-[#71717a] hover:text-[#e4e4e7] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="font-semibold text-[#e4e4e7] text-lg">{selected.name}</h3>
              <span className="text-sm text-[#71717a]">
                Lent: ${selected.totalLent.toLocaleString()} | Owed: ${selected.totalOwed.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {selected.entries.map((entry) => (
              <div key={entry.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#1a1a25] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#e4e4e7]">{entry.description}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">{entry.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${entry.type === "lent" ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {entry.type === "lent" ? "+" : "-"}{entry.amount.toLocaleString()} {entry.currency}
                  </span>
                  <button
                    onClick={() => deleteEntry(selected.id, entry.id)}
                    className="p-1 text-[#71717a] hover:text-[#ef4444] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {selected.entries.length === 0 && (
              <div className="px-6 py-8 text-center text-[#71717a]">No debt entries</div>
            )}
          </div>
        </div>
      ) : (
        /* User Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {debtors.map((debtor) => (
            <button
              key={debtor.id}
              onClick={() => setSelectedDebtor(debtor.id)}
              className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:bg-[#1a1a25] transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center text-[#6c5ce7] font-semibold text-sm">
                  {debtor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#e4e4e7]">{debtor.name}</p>
                  <p className="text-xs text-[#71717a]">Last: {debtor.lastTransaction}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-[#71717a]">Lent</p>
                  <p className="text-[#22c55e] font-medium">
                    {debtor.totalLent > 0 ? `${debtor.totalLent.toLocaleString()} ${debtor.currency}` : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#71717a]">Owed</p>
                  <p className="text-[#ef4444] font-medium">
                    {debtor.totalOwed > 0 ? `${debtor.totalOwed.toLocaleString()} ${debtor.currency}` : "—"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add Debt Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl w-full max-w-md p-6 space-y-4 slide-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#e4e4e7]">Add Debt</h3>
              <button
                onClick={() => setShowAdd(false)}
                className="text-[#71717a] hover:text-[#e4e4e7] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Person</label>
              <select
                value={newDebt.userId}
                onChange={(e) => setNewDebt((prev) => ({ ...prev, userId: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              >
                <option value="">Select person...</option>
                {debtors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#71717a] mb-1.5">Amount</label>
                <input
                  type="number"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[#71717a] mb-1.5">Currency</label>
                <select
                  value={newDebt.currency}
                  onChange={(e) => setNewDebt((prev) => ({ ...prev, currency: e.target.value }))}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] focus:outline-none focus:border-[#6c5ce7] transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="IRR">IRR</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#71717a] mb-1.5">Description</label>
              <input
                type="text"
                value={newDebt.description}
                onChange={(e) => setNewDebt((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What was this for?"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#7c6cf7] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-[#0a0a0f] border border-[#1e1e2e] text-[#71717a] text-sm font-medium rounded-lg hover:text-[#e4e4e7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
