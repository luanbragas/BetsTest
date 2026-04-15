import { Body, Controller, Post } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { AuthDto, RecoverDto } from "./dto";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post("sign-up")
  async signUp(@Body() dto: AuthDto) {
    const client = this.supabase.publicClient();
    const { data, error } = await client.auth.signUp({
      email: dto.email,
      password: dto.password
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      message: data.session ? "Conta criada." : "Conta criada. Confirme seu e-mail se o Supabase exigir.",
      session: data.session,
      user: data.user
    };
  }

  @Post("sign-in")
  async signIn(@Body() dto: AuthDto) {
    const client = this.supabase.publicClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return {
      ok: true,
      session: data.session,
      user: data.user
    };
  }

  @Post("recover")
  async recover(@Body() dto: RecoverDto) {
    const client = this.supabase.publicClient();
    const { error } = await client.auth.resetPasswordForEmail(dto.email);

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "E-mail de recuperação enviado." };
  }
}
