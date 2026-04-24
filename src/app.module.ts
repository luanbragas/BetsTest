import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { BetsModule } from "./bets/bets.module";
import { FriendsModule } from "./friends/friends.module";
import { SettingsModule } from "./settings/settings.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    BetsModule,
    SettingsModule,
    FriendsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
