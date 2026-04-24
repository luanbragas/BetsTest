import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";

@Module({
  imports: [SupabaseModule],
  controllers: [SettingsController],
  providers: [SettingsService, SupabaseAuthGuard],
  exports: [SettingsService]
})
export class SettingsModule {}

