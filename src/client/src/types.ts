export type BetStatus = "win" | "loss" | "push" | "open";

export type Bet = {
  id: string;
  platform: string;
  category: string;
  date: string;
  time: string;
  stake: number;
  returnValue: number;
  status: BetStatus;
  notes: string;
  createdAt?: string;
};

export type BetPayload = Omit<Bet, "id" | "createdAt">;

export type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
};

export type User = {
  id?: string;
  email?: string;
};

export type AuthState = {
  session: Session;
  user: User;
};

export type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export type Period = "day" | "week" | "month" | "custom" | "all";

export type AppPage = "dashboard" | "new" | "flow" | "operations" | "performance";

export type FilterState = {
  period: Period;
  customStart: string;
  customEnd: string;
  platform: string;
  category: string;
};

export type Totals = {
  profit: number;
  loss: number;
  net: number;
  hitRate: number;
  bestPlatform?: string;
};
