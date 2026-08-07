"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Plus, Trash2, ChevronLeft } from "lucide-react";

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
              totalLent: d.entries
                .filter((e) => e.id !== entryId && e.type === "lent")
                .reduce((s, e) => s + e.amount, 0),
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
          <h1 className="text-2xl font-bold text-foreground">Debts</h1>
          <p className="text-muted-foreground mt-1">Track debts and lending</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger render={<Button className="gap-2" />}>
              <Plus className="h-4 w-4" />
              Add Debt
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Debt</DialogTitle>
              <DialogDescription>Record a new debt or lending entry.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Person</label>
                <Select
                  value={newDebt.userId}
                  onValueChange={(value) => { if (value !== null) setNewDebt((prev) => ({ ...prev, userId: value })) }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person..." />
                  </SelectTrigger>
                  <SelectContent>
                    {debtors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Amount</label>
                  <Input
                    type="number"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Currency</label>
                  <Select
                    value={newDebt.currency}
                    onValueChange={(value) => { if (value !== null) setNewDebt((prev) => ({ ...prev, currency: value })) }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="IRR">IRR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Description</label>
                <Input
                  type="text"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What was this for?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight size={16} className="text-green-500" />
              <p className="text-sm text-muted-foreground">Total Owed to Me</p>
            </div>
            <p className="text-2xl font-bold text-green-500 mt-1">
              ${totalLent.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownLeft size={16} className="text-red-500" />
              <p className="text-sm text-muted-foreground">Total I Owe</p>
            </div>
            <p className="text-2xl font-bold text-red-500 mt-1">
              ${totalOwed.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className={netBalance >= 0 ? "text-green-500" : "text-red-500"} />
              <p className="text-sm text-muted-foreground">Net Balance</p>
            </div>
            <p
              className={`text-2xl font-bold mt-1 ${
                netBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {netBalance >= 0 ? "+" : ""}${netBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Detail View */}
      {selected ? (
        <Card className="animate-in slide-in-from-left-4">
          <CardHeader className="flex flex-row items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDebtor(null)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-lg">{selected.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Lent: ${selected.totalLent.toLocaleString()} | Owed: ${selected.totalOwed.toLocaleString()}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {selected.entries.map((entry) => (
                <div key={entry.id} className="px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        entry.type === "lent" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {entry.type === "lent" ? "+" : "-"}
                      {entry.amount.toLocaleString()} {entry.currency}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteEntry(selected.id, entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {selected.entries.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground">No debt entries</div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* User Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {debtors.map((debtor) => (
            <Card
              key={debtor.id}
              className="hover:bg-accent/50 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedDebtor(debtor.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                      {debtor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{debtor.name}</p>
                    <p className="text-xs text-muted-foreground">Last: {debtor.lastTransaction}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Lent</p>
                    <p className="text-green-500 font-medium">
                      {debtor.totalLent > 0
                        ? `${debtor.totalLent.toLocaleString()} ${debtor.currency}`
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Owed</p>
                    <p className="text-red-500 font-medium">
                      {debtor.totalOwed > 0
                        ? `${debtor.totalOwed.toLocaleString()} ${debtor.currency}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
