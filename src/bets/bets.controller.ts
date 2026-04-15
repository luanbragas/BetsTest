import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CurrentUser as CurrentUserDecorator, CurrentUser } from "../auth/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { BetDto, FlowDto, ImportDto } from "./dto";
import { parseNaturalBet } from "./natural-language";
import { BetsService } from "./bets.service";

type AuthedRequest = {
  accessToken: string;
};

@UseGuards(SupabaseAuthGuard)
@Controller("api/bets")
export class BetsController {
  constructor(private readonly bets: BetsService) {}

  @Get()
  list(@Req() request: AuthedRequest, @CurrentUserDecorator() user: CurrentUser) {
    return this.bets.list(request.accessToken, user.id);
  }

  @Post()
  create(@Req() request: AuthedRequest, @CurrentUserDecorator() user: CurrentUser, @Body() dto: BetDto) {
    return this.bets.create(request.accessToken, user.id, dto);
  }

  @Post("import")
  import(@Req() request: AuthedRequest, @CurrentUserDecorator() user: CurrentUser, @Body() dto: ImportDto) {
    return this.bets.createMany(request.accessToken, user.id, dto.bets || []);
  }

  @Post("flow")
  flow(@Req() request: AuthedRequest, @CurrentUserDecorator() user: CurrentUser, @Body() dto: FlowDto) {
    const parsed = parseNaturalBet(dto.text);
    return this.bets.create(request.accessToken, user.id, parsed);
  }

  @Patch(":id")
  update(
    @Req() request: AuthedRequest,
    @CurrentUserDecorator() user: CurrentUser,
    @Param("id") id: string,
    @Body() dto: BetDto
  ) {
    return this.bets.update(request.accessToken, user.id, id, dto);
  }

  @Delete(":id")
  remove(@Req() request: AuthedRequest, @CurrentUserDecorator() user: CurrentUser, @Param("id") id: string) {
    return this.bets.remove(request.accessToken, user.id, id);
  }
}
