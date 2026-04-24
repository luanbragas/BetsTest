import { BetDto, BetStatus } from "./dto";
import { DEFAULT_PLATFORMS } from "./platforms";

export function parseNaturalBet(text: string, knownPlatforms: string[] = DEFAULT_PLATFORMS): BetDto {
  const normalized = removeAccents(text.toLowerCase());
  const platform = extractPlatform(text, knownPlatforms);
  const values = extractNumbers(stripPlatformFromText(normalized, platform));

  if (!platform) {
    throw new Error('Não consegui identificar a plataforma. Tente: "Ganhei 200 na Bet365 hoje".');
  }

  if (!values.length) {
    throw new Error("Não consegui identificar valores. Inclua o valor investido ou final.");
  }

  let stake = 0;
  let returnValue = 0;
  let status: BetStatus = "win";

  if (hasAny(normalized, ["perdi", "perdeu", "loss", "derrota"])) {
    stake = values[0];
    returnValue = 0;
    status = "loss";
  } else if (
    hasAny(normalized, ["depositei", "apostei", "aposta", "entrada", "investi"]) &&
    hasAny(normalized, ["saquei", "virou", "retirei", "final"])
  ) {
    stake = values[0];
    returnValue = values[1] ?? values[0];
    status = inferStatus(stake, returnValue);
  } else if (hasAny(normalized, ["ganhei", "lucro", "lucrei"])) {
    if (values.length >= 2) {
      stake = values[0];
      returnValue = values[1];
    } else {
      stake = 0;
      returnValue = values[0];
    }
    status = "win";
  } else {
    stake = values[0];
    returnValue = values[1] ?? values[0];
    status = inferStatus(stake, returnValue);
  }

  return {
    platform,
    category: inferCategory(normalized),
    date: toInputDate(extractDate(normalized)),
    time: toInputTime(new Date()),
    stake,
    returnValue,
    status,
    notes: text
  };
}

function inferStatus(stake: number, returnValue: number): BetStatus {
  if (returnValue > stake) return "win";
  if (returnValue < stake) return "loss";
  return "push";
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+(?:[.,]\d+)?/g) || [];
  return matches.map((item) => Number(item.replace(",", ".")));
}

function extractPlatform(text: string, known: string[]): string {
  const lower = removeAccents(text.toLowerCase());
  const found = known.find((platform) => lower.includes(removeAccents(platform.toLowerCase())));
  if (found) return found;

  const match = text.match(/\b(?:na|no|pela|pelo|em)\s+([a-z0-9 ]+)/i);
  if (!match) return "";

  const stopWords = ["hoje", "ontem", "anteontem", "dia", "as", "com", "de", "por"];
  const parts = match[1]
    .trim()
    .split(/\s+/)
    .filter((part) => !stopWords.includes(removeAccents(part.toLowerCase())));

  return cleanName(parts.slice(0, 3).join(" "));
}

function stripPlatformFromText(text: string, platform: string): string {
  if (!platform) return text;
  const escaped = removeAccents(platform.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
  return text.replace(new RegExp(escaped, "gi"), " ");
}

function extractDate(text: string): Date {
  const now = new Date();
  if (text.includes("anteontem")) return addDays(now, -2);
  if (text.includes("ontem")) return addDays(now, -1);

  const match = text.match(/(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?/);
  if (match) {
    let year = match[3] ? Number(match[3]) : now.getFullYear();
    if (year < 100) year += 2000;
    return new Date(year, Number(match[2]) - 1, Number(match[1]));
  }

  return now;
}

function inferCategory(text: string): string {
  if (hasAny(text, ["futebol", "escanteio", "gol", "cartao"])) return "Futebol";
  if (hasAny(text, ["basquete", "nba"])) return "Basquete";
  if (hasAny(text, ["tenis", "set"])) return "Tênis";
  if (hasAny(text, ["multipla", "combo"])) return "Múltipla";
  if (hasAny(text, ["ao vivo", "live"])) return "Ao vivo";
  return "Outro";
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function cleanName(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function removeAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toInputDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toInputTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
