import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { SettingsModule } from "../settings/settings.module";
import { BetsController } from "./bets.controller";
import { BetsService } from "./bets.service";

@Module({
  imports: [SupabaseModule, SettingsModule],
  controllers: [BetsController],
  providers: [BetsService, SupabaseAuthGuard]
})
export class BetsModule {}
