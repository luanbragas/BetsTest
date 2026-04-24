import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { DEFAULT_PLATFORMS } from "../bets/platforms";

const OWNER_EMAIL = "luanbragash23@gmail.com";

type PlatformRow = {
  name: string;
};

type AdminRow = {
  email: string;
};

export type AdminUser = {
  email: string;
  isOwner: boolean;
};

@Injectable()
export class SettingsService {
  constructor(private readonly supabase: SupabaseService) {}

  isOwner(email?: string): boolean {
    return normalizeEmail(email) === OWNER_EMAIL;
  }

  async getAccess(email?: string): Promise<{ isAdmin: boolean; canManageAdmins: boolean }> {
    const owner = this.isOwner(email);
    if (owner) return { isAdmin: true, canManageAdmins: true };

    const normalized = normalizeEmail(email);
    if (!normalized) return { isAdmin: false, canManageAdmins: false };

    try {
      const client = this.supabase.serviceClient();
      const { data, error } = await client.from("admin_users").select("email").eq("email", normalized).maybeSingle();
      if (error) throw error;
      return { isAdmin: Boolean(data), canManageAdmins: false };
    } catch {
      return { isAdmin: false, canManageAdmins: false };
    }
  }

  async listPlatforms(): Promise<string[]> {
    try {
      const client = this.supabase.serviceClient();
      const { data, error } = await client.from("betting_houses").select("name").order("name", { ascending: true });
      if (error) throw error;
      return uniquePlatforms([...DEFAULT_PLATFORMS, ...(data || []).map((row) => (row as PlatformRow).name)]);
    } catch {
      return DEFAULT_PLATFORMS;
    }
  }

  async createPlatform(email: string | undefined, name: string): Promise<{ name: string }> {
    const access = await this.getAccess(email);
    if (!access.isAdmin) throw new ForbiddenException("Apenas o admin pode cadastrar casas de aposta.");

    const clean = cleanName(name);
    const client = this.supabase.serviceClient();
    const { error } = await client.from("betting_houses").upsert({ name: clean }, { onConflict: "name" });
    if (error) {
      if (isMissingBettingHousesTable(error.message)) {
        throw new InternalServerErrorException(
          "A tabela public.betting_houses ainda nao existe no Supabase. Execute o arquivo supabase/schema.sql no SQL Editor e tente novamente."
        );
      }
      throw new InternalServerErrorException(error.message);
    }
    return { name: clean };
  }

  async removePlatform(email: string | undefined, name: string): Promise<void> {
    const access = await this.getAccess(email);
    if (!access.isAdmin) throw new ForbiddenException("Apenas o admin pode remover casas de aposta.");

    const clean = cleanName(name);
    if (!clean) return;

    const client = this.supabase.serviceClient();
    const { error } = await client.from("betting_houses").delete().eq("name", clean);
    if (error) {
      if (isMissingBettingHousesTable(error.message)) {
        throw new InternalServerErrorException(
          "A tabela public.betting_houses ainda nao existe no Supabase. Execute o arquivo supabase/schema.sql no SQL Editor e tente novamente."
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAdmins(email: string | undefined): Promise<AdminUser[]> {
    this.ensureOwner(email);

    try {
      const client = this.supabase.serviceClient();
      const { data, error } = await client.from("admin_users").select("email").order("email", { ascending: true });
      if (error) throw error;

      const emails = uniqueEmails([OWNER_EMAIL, ...((data || []) as AdminRow[]).map((row) => row.email)]);
      return emails.map((value) => ({ email: value, isOwner: value === OWNER_EMAIL }));
    } catch (error) {
      if (isMissingAdminUsersTable(getErrorMessage(error))) {
        return [{ email: OWNER_EMAIL, isOwner: true }];
      }
      throw new InternalServerErrorException(getErrorMessage(error));
    }
  }

  async addAdmin(email: string | undefined, targetEmail: string): Promise<AdminUser> {
    this.ensureOwner(email);

    const normalized = normalizeEmail(targetEmail);
    if (!normalized) throw new ForbiddenException("Informe um e-mail valido para liberar acesso admin.");
    if (normalized === OWNER_EMAIL) return { email: OWNER_EMAIL, isOwner: true };

    const client = this.supabase.serviceClient();
    const { error } = await client.from("admin_users").upsert({ email: normalized }, { onConflict: "email" });
    if (error) {
      if (isMissingAdminUsersTable(error.message)) {
        throw new InternalServerErrorException(
          "A tabela public.admin_users ainda nao existe no Supabase. Execute o arquivo supabase/schema.sql no SQL Editor e tente novamente."
        );
      }
      throw new InternalServerErrorException(error.message);
    }

    return { email: normalized, isOwner: false };
  }

  async removeAdmin(email: string | undefined, targetEmail: string): Promise<void> {
    this.ensureOwner(email);

    const normalized = normalizeEmail(targetEmail);
    if (!normalized) return;
    if (normalized === OWNER_EMAIL) {
      throw new ForbiddenException("O dono principal nao pode perder o proprio acesso admin.");
    }

    const client = this.supabase.serviceClient();
    const { error } = await client.from("admin_users").delete().eq("email", normalized);
    if (error) {
      if (isMissingAdminUsersTable(error.message)) {
        throw new InternalServerErrorException(
          "A tabela public.admin_users ainda nao existe no Supabase. Execute o arquivo supabase/schema.sql no SQL Editor e tente novamente."
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  private ensureOwner(email?: string) {
    if (!this.isOwner(email)) {
      throw new ForbiddenException("Apenas o dono principal pode gerenciar quem recebe acesso admin.");
    }
  }
}

function uniquePlatforms(values: string[]): string[] {
  return values
    .map(cleanName)
    .filter(Boolean)
    .filter((value, index, array) => array.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function cleanName(value: string): string {
  return String(value || "").trim().replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isMissingBettingHousesTable(message: string): boolean {
  const text = String(message || "").toLowerCase();
  return text.includes("public.betting_houses") && text.includes("schema cache");
}

function isMissingAdminUsersTable(message: string): boolean {
  const text = String(message || "").toLowerCase();
  return text.includes("public.admin_users") && text.includes("schema cache");
}

function normalizeEmail(value?: string): string {
  return String(value || "").trim().toLowerCase();
}

function uniqueEmails(values: string[]): string[] {
  return values.filter(Boolean).filter((value, index, array) => array.indexOf(value) === index).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error || "Erro inesperado.");
}
