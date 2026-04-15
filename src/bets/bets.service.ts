import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { BetDto } from "./dto";

type BetRow = {
  id: string;
  user_id: string;
  platform: string;
  category: string;
  date: string;
  time: string;
  stake: number;
  return_value: number;
  status: string;
  notes: string | null;
  created_at: string;
};

@Injectable()
export class BetsService {
  constructor(private readonly supabase: SupabaseService) {}

  async list(accessToken: string, userId: string) {
    const client = this.supabase.userClient(accessToken);
    const { data, error } = await client
      .from("bets")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.toClient);
  }

  async create(accessToken: string, userId: string, dto: BetDto) {
    const client = this.supabase.userClient(accessToken);
    const { data, error } = await client
      .from("bets")
      .insert(this.toRow(dto, userId))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return this.toClient(data as BetRow);
  }

  async createMany(accessToken: string, userId: string, bets: BetDto[]) {
    if (!bets.length) return [];

    const client = this.supabase.userClient(accessToken);
    const { data, error } = await client
      .from("bets")
      .insert(bets.map((bet) => this.toRow(bet, userId)))
      .select("*");

    if (error) throw new Error(error.message);
    return (data || []).map(this.toClient);
  }

  async update(accessToken: string, userId: string, id: string, dto: BetDto) {
    const client = this.supabase.userClient(accessToken);
    const { data, error } = await client
      .from("bets")
      .update(this.toRow(dto, userId))
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new NotFoundException(error.message);
    return this.toClient(data as BetRow);
  }

  async remove(accessToken: string, userId: string, id: string) {
    const client = this.supabase.userClient(accessToken);
    const { error } = await client.from("bets").delete().eq("id", id).eq("user_id", userId);

    if (error) throw new NotFoundException(error.message);
    return { ok: true };
  }

  private toRow(dto: BetDto, userId: string) {
    return {
      user_id: userId,
      platform: dto.platform.trim(),
      category: dto.category,
      date: dto.date,
      time: dto.time,
      stake: dto.stake,
      return_value: dto.returnValue,
      status: dto.status,
      notes: dto.notes || null
    };
  }

  private toClient(row: BetRow) {
    return {
      id: row.id,
      platform: row.platform,
      category: row.category,
      date: row.date,
      time: row.time,
      stake: Number(row.stake),
      returnValue: Number(row.return_value),
      status: row.status,
      notes: row.notes || "",
      createdAt: row.created_at
    };
  }
}
