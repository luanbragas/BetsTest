import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CurrentUser } from "./current-user.decorator";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      accessToken?: string;
      user?: CurrentUser;
    }>();
    const authorization = request.headers.authorization || "";
    const token = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      throw new UnauthorizedException("Sessão expirada. Faça login novamente.");
    }

    const client = this.supabase.publicClient();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException("Sessão inválida.");
    }

    request.accessToken = token;
    request.user = {
      id: data.user.id,
      email: data.user.email
    };

    return true;
  }
}
