import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController]
})
export class AuthModule {}
