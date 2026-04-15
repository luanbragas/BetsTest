import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { BetsController } from "./bets.controller";
import { BetsService } from "./bets.service";

@Module({
  imports: [SupabaseModule],
  controllers: [BetsController],
  providers: [BetsService, SupabaseAuthGuard]
})
export class BetsModule {}
