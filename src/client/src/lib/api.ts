import type { AuthState, Bet, BetPayload } from "../types";

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  skipAuth?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (!options.skipAuth && options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload.message || "Erro na comunicação com a API.");
  }

  return payload as T;
}

export async function signIn(email: string, password: string): Promise<AuthState & { ok: boolean; message?: string }> {
  return api("/api/auth/sign-in", {
    method: "POST",
    body: { email, password },
    skipAuth: true
  });
}

export async function signUp(email: string, password: string): Promise<Partial<AuthState> & { ok: boolean; message?: string }> {
  return api("/api/auth/sign-up", {
    method: "POST",
    body: { email, password },
    skipAuth: true
  });
}

export async function recoverPassword(email: string): Promise<{ ok: boolean; message: string }> {
  return api("/api/auth/recover", {
    method: "POST",
    body: { email },
    skipAuth: true
  });
}

export function listBets(token: string): Promise<Bet[]> {
  return api("/api/bets", { token });
}

export function createBet(token: string, bet: BetPayload): Promise<Bet> {
  return api("/api/bets", { method: "POST", token, body: bet });
}

export function updateBet(token: string, id: string, bet: BetPayload): Promise<Bet> {
  return api(`/api/bets/${id}`, { method: "PATCH", token, body: bet });
}

export function deleteBet(token: string, id: string): Promise<{ ok: boolean }> {
  return api(`/api/bets/${id}`, { method: "DELETE", token });
}

export function createFlowBet(token: string, text: string): Promise<Bet> {
  return api("/api/bets/flow", { method: "POST", token, body: { text } });
}

export function importBets(token: string, bets: BetPayload[]): Promise<Bet[]> {
  return api("/api/bets/import", { method: "POST", token, body: { bets } });
}
