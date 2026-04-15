import type { Bet, BetPayload, BetStatus, FilterState, Totals } from "../types";
import {
  addDays,
  cleanName,
  endOfDay,
  getBetResult,
  parseLocalDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toInputDate,
  toInputTime
} from "./format";

export function defaultFilters(): FilterState {
  return {
    period: "month",
    customStart: toInputDate(startOfMonth(new Date())),
    customEnd: toInputDate(new Date()),
    platform: "all",
    category: "all"
  };
}

export function emptyBet(): BetPayload {
  const now = new Date();
  return {
    platform: "",
    category: "Geral",
    date: toInputDate(now),
    time: toInputTime(now),
    stake: 0,
    returnValue: 0,
    status: "win",
    notes: ""
  };
}

export function demoBets(): BetPayload[] {
  const now = new Date();
  return [
    { platform: "Betboom", category: "Futebol", date: toInputDate(now), time: "14:25", stake: 30, returnValue: 74, status: "win", notes: "Aposta de 30 virou 74 na Betboom" },
    { platform: "PixBet", category: "Ao vivo", date: toInputDate(addDays(now, -1)), time: "21:10", stake: 50, returnValue: 0, status: "loss", notes: "Perdi 50 reais na PixBet ontem" },
    { platform: "Betano", category: "Multipla", date: toInputDate(addDays(now, -2)), time: "19:40", stake: 120, returnValue: 185, status: "win", notes: "Depositei 120 e saquei 185 na Betano" }
  ];
}

export function filterBets(bets: Bet[], filters: FilterState): Bet[] {
  const range = getDateRange(filters);
  return bets
    .filter((bet) => {
      const date = parseLocalDate(bet.date);
      const inRange = (!range.start || date >= range.start) && (!range.end || date <= range.end);
      const platformMatch = filters.platform === "all" || bet.platform === filters.platform;
      const categoryMatch = filters.category === "all" || bet.category === filters.category;
      return inRange && platformMatch && categoryMatch;
    })
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
}

export function calculateTotals(bets: Bet[]): Totals {
  let profit = 0;
  let loss = 0;
  let wins = 0;
  const platformMap = new Map<string, number>();

  bets.forEach((bet) => {
    const result = getBetResult(bet);
    if (result > 0) {
      profit += result;
      wins += 1;
    }
    if (result < 0) loss += Math.abs(result);
    platformMap.set(bet.platform, (platformMap.get(bet.platform) || 0) + result);
  });

  const bestPlatform = Array.from(platformMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  return {
    profit,
    loss,
    net: profit - loss,
    hitRate: bets.length ? (wins / bets.length) * 100 : 0,
    bestPlatform
  };
}

export function uniqueValues(values: string[]): string[] {
  return values
    .filter(Boolean)
    .map((value) => value.trim())
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function parseCsv(csv: string): BetPayload[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return {
      platform: cleanName(cells[0] || "Importado"),
      category: cells[1] || "Outro",
      date: cells[2] || toInputDate(new Date()),
      time: cells[3] || toInputTime(new Date()),
      stake: Number(String(cells[4] || "0").replace(",", ".")),
      returnValue: Number(String(cells[5] || "0").replace(",", ".")),
      status: normalizeStatus(cells[6]),
      notes: cells[7] || ""
    };
  });
}

export function toCsv(bets: Bet[]): string {
  const rows = [["Plataforma", "Categoria", "Data", "Horario", "Valor investido", "Valor final", "Status", "Observacoes"]];
  bets.forEach((bet) => rows.push([bet.platform, bet.category, bet.date, bet.time, String(bet.stake), String(bet.returnValue), bet.status, bet.notes || ""]));
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function getDateRange(filters: FilterState): { start: Date | null; end: Date | null } {
  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = endOfDay(now);

  if (filters.period === "day") start = startOfDay(now);
  if (filters.period === "week") start = startOfWeek(now);
  if (filters.period === "month") start = startOfMonth(now);
  if (filters.period === "custom") {
    start = filters.customStart ? startOfDay(parseLocalDate(filters.customStart)) : null;
    end = filters.customEnd ? endOfDay(parseLocalDate(filters.customEnd)) : null;
  }
  if (filters.period === "all") {
    start = null;
    end = null;
  }

  return { start, end };
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inside = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inside = !inside;
    } else if (char === "," && !inside) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function csvCell(value: string): string {
  const text = String(value || "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function normalizeStatus(value?: string): BetStatus {
  if (value === "loss" || value === "push" || value === "open" || value === "win") return value;
  return "win";
}
