import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("api")
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get("health")
  health() {
    return {
      ok: true,
      name: "WililiDash",
      supabaseConfigured: Boolean(this.config.get<string>("SUPABASE_URL") && this.config.get<string>("SUPABASE_ANON_KEY"))
    };
  }

  @Get("config")
  publicConfig() {
    return {
      supabaseUrl: this.config.get<string>("SUPABASE_URL") || "",
      hasSupabaseKey: Boolean(this.config.get<string>("SUPABASE_ANON_KEY"))
    };
  }
}
