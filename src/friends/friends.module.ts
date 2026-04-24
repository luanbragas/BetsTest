import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./friends.service";

@Module({
  imports: [SupabaseModule],
  controllers: [FriendsController],
  providers: [FriendsService, SupabaseAuthGuard]
})
export class FriendsModule {}

