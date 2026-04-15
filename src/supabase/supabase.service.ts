import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;

  constructor(private readonly config: ConfigService) {
    this.url = this.config.get<string>("SUPABASE_URL") || "";
    this.anonKey = this.config.get<string>("SUPABASE_ANON_KEY") || "";
  }

  publicClient(): SupabaseClient {
    return this.create();
  }

  userClient(accessToken: string): SupabaseClient {
    return this.create(accessToken);
  }

  private create(accessToken?: string): SupabaseClient {
    if (!this.url || !this.anonKey) {
      throw new InternalServerErrorException("Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env.");
    }

    return createClient(this.url, this.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        : undefined
    });
  }
}
