import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

type BetRow = {
  user_id: string;
  platform: string;
  stake: number;
  return_value: number;
  status: string;
};

type FriendSummary = {
  email: string;
  name: string;
  found: boolean;
  betCount: number;
  profit: number;
  loss: number;
  net: number;
  hitRate: number;
  bestPlatform?: string;
};

@Injectable()
export class FriendsService {
  constructor(private readonly supabase: SupabaseService) {}

  async summaries(emails: string[], currentUserId: string): Promise<FriendSummary[]> {
    const normalizedEmails = uniqueEmails(emails);
    if (!normalizedEmails.length) return [];

    const client = this.supabase.serviceClient();
    const { data, error } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw new Error(error.message);

    const users = data.users.filter((user) => {
      const email = String(user.email || "").toLowerCase();
      return user.id !== currentUserId && normalizedEmails.includes(email);
    });
    const userByEmail = new Map(users.map((user) => [String(user.email || "").toLowerCase(), user]));
    const rows = await this.listBetRows(users.map((user) => user.id));

    return normalizedEmails.map((email) => {
      const user = userByEmail.get(email);
      if (!user) return emptySummary(email, false);
      return summarize(email, rows.filter((row) => row.user_id === user.id));
    });
  }

  private async listBetRows(userIds: string[]): Promise<BetRow[]> {
    if (!userIds.length) return [];

    const client = this.supabase.serviceClient();
    const { data, error } = await client
      .from("bets")
      .select("user_id, platform, stake, return_value, status")
      .in("user_id", userIds);

    if (error) throw new Error(error.message);
    return (data || []) as BetRow[];
  }
}

function summarize(email: string, rows: BetRow[]): FriendSummary {
  let profit = 0;
  let loss = 0;
  let wins = 0;
  const platformMap = new Map<string, number>();

  rows.forEach((row) => {
    const result = row.status === "open" ? 0 : Number(row.return_value || 0) - Number(row.stake || 0);
    if (result > 0) {
      profit += result;
      wins += 1;
    }
    if (result < 0) loss += Math.abs(result);
    platformMap.set(row.platform, (platformMap.get(row.platform) || 0) + result);
  });

  const bestPlatform = Array.from(platformMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  return {
    ...emptySummary(email, true),
    betCount: rows.length,
    profit,
    loss,
    net: profit - loss,
    hitRate: rows.length ? (wins / rows.length) * 100 : 0,
    bestPlatform
  };
}

function emptySummary(email: string, found: boolean): FriendSummary {
  return {
    email,
    name: displayName(email),
    found,
    betCount: 0,
    profit: 0,
    loss: 0,
    net: 0,
    hitRate: 0
  };
}

function uniqueEmails(values: string[]): string[] {
  return values
    .map((value) => String(value || "").trim().toLowerCase())
    .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 24);
}

function displayName(email: string): string {
  return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

