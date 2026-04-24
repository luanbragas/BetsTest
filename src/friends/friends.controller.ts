import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser as CurrentUserDecorator, CurrentUser } from "../auth/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { FriendsService } from "./friends.service";

@UseGuards(SupabaseAuthGuard)
@Controller("api/friends")
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get("summary")
  summary(@CurrentUserDecorator() user: CurrentUser, @Query("emails") emails = "") {
    return this.friends.summaries(String(emails).split(","), user.id);
  }
}

