import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;
  private readonly serviceRoleKey: string;

  constructor(private readonly config: ConfigService) {
    this.url = this.config.get<string>("SUPABASE_URL") || "";
    this.anonKey = this.config.get<string>("SUPABASE_ANON_KEY") || "";
    this.serviceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY") || "";
  }

  publicClient(): SupabaseClient {
    return this.create();
  }

  userClient(accessToken: string): SupabaseClient {
    return this.create(accessToken);
  }

  serviceClient(): SupabaseClient {
    if (!this.url || !this.serviceRoleKey) {
      throw new InternalServerErrorException("Configure SUPABASE_SERVICE_ROLE_KEY no .env para usar este recurso.");
    }

    return createClient(this.url, this.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
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
