import type { Bet, BetPayload, BetStatus } from "../types";

export function getBetResult(bet: Pick<Bet, "status" | "stake" | "returnValue">): number {
  if (bet.status === "open") return 0;
  return Number(bet.returnValue || 0) - Number(bet.stake || 0);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(Number(value || 0)) + "%";
}

export function formatDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString("pt-BR");
}

export function displayName(email?: string): string {
  return cleanName(String(email || "membro").split("@")[0].replace(/[._-]+/g, " "));
}

export function cleanName(value: string): string {
  return String(value || "").trim().replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function toInputDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toInputTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDate(value: string): Date {
  const parts = String(value).split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return startOfDay(addDays(date, diff));
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function nextStatus(status: BetStatus): BetStatus {
  if (status === "open") return "win";
  if (status === "win") return "loss";
  if (status === "loss") return "push";
  return "open";
}

export function statusLabel(status: BetStatus): string {
  if (status === "win") return "Ganha";
  if (status === "loss") return "Perdida";
  if (status === "push") return "Empate";
  return "Aberta";
}

export function stripClientFields(bet: Bet): BetPayload {
  return {
    platform: bet.platform,
    category: bet.category,
    date: bet.date,
    time: bet.time,
    stake: Number(bet.stake || 0),
    returnValue: Number(bet.returnValue || 0),
    status: bet.status,
    notes: bet.notes || ""
  };
}

export function statusClass(value: number): string {
  if (value > 0) return "border-gain/30 bg-gain/10 text-gain";
  if (value < 0) return "border-danger/30 bg-danger/10 text-danger";
  return "border-neon/30 bg-neon/10 text-neon";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
