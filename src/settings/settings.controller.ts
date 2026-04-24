import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser as CurrentUserDecorator, CurrentUser } from "../auth/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { AdminEmailDto, PlatformDto } from "./dto";
import { SettingsService } from "./settings.service";

@UseGuards(SupabaseAuthGuard)
@Controller("api/settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get("platforms")
  async platforms(@CurrentUserDecorator() user: CurrentUser) {
    const access = await this.settings.getAccess(user.email);
    return {
      platforms: await this.settings.listPlatforms(),
      isAdmin: access.isAdmin,
      canManageAdmins: access.canManageAdmins
    };
  }

  @Post("platforms")
  async createPlatform(@CurrentUserDecorator() user: CurrentUser, @Body() dto: PlatformDto) {
    const platform = await this.settings.createPlatform(user.email, dto.name);
    return { platform };
  }

  @Delete("platforms")
  async removePlatform(@CurrentUserDecorator() user: CurrentUser, @Query("name") name = "") {
    await this.settings.removePlatform(user.email, name);
    return { ok: true };
  }

  @Get("admins")
  async admins(@CurrentUserDecorator() user: CurrentUser) {
    return {
      admins: await this.settings.listAdmins(user.email)
    };
  }

  @Post("admins")
  async createAdmin(@CurrentUserDecorator() user: CurrentUser, @Body() dto: AdminEmailDto) {
    return {
      admin: await this.settings.addAdmin(user.email, dto.email)
    };
  }

  @Delete("admins")
  async removeAdmin(@CurrentUserDecorator() user: CurrentUser, @Query("email") email = "") {
    await this.settings.removeAdmin(user.email, email);
    return { ok: true };
  }
}
