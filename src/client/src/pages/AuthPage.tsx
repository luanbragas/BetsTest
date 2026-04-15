import { FormEvent, useState } from "react";
import { recoverPassword, signIn, signUp } from "../lib/api";
import type { AuthState, ToastState } from "../types";

type Props = {
  onAuth: (auth: AuthState, remember: boolean) => void;
  onToast: (toast: ToastState) => void;
};

export function AuthPage({ onAuth, onToast }: Props) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("Use Supabase Auth para sessão real e dados persistentes.");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = mode === "sign-in" ? await signIn(email, password) : await signUp(email, password);

      if (!response.ok) {
        throw new Error(response.message || "Não foi possível autenticar.");
      }

      if (!response.session || !response.user) {
        setMessage(response.message || "Conta criada. Confirme seu e-mail antes de entrar.");
        setMode("sign-in");
        return;
      }

      onAuth({ session: response.session, user: response.user }, remember);
      onToast({ message: "Bem-vindo ao WililiDash.", type: "success" });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Erro inesperado.";
      setMessage(text);
      onToast({ message: text, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function recover() {
    if (!email) {
      onToast({ message: "Digite seu e-mail para recuperar a senha.", type: "error" });
      return;
    }

    try {
      const response = await recoverPassword(email);
      onToast({ message: response.message || "E-mail de recuperação enviado.", type: "success" });
    } catch (error) {
      onToast({ message: error instanceof Error ? error.message : "Falha ao recuperar senha.", type: "error" });
    }
  }

  const isSignIn = mode === "sign-in";

  return (
    <section className="grid min-h-screen place-items-center px-5 py-10">
      <div className="grid w-full min-w-0 max-w-full gap-8 lg:max-w-6xl lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="min-w-0 space-y-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-gold/30 bg-white/[0.04] font-display text-xl font-black text-gold-soft shadow-glow">
            WD
          </div>
          <div className="min-w-0 max-w-2xl space-y-5">
            <p className="break-words text-xs font-black uppercase text-gold">Performance privada para banca esportiva</p>
            <h1 className="break-words font-display text-4xl font-black leading-none text-gold-soft sm:text-5xl md:text-7xl">WililiDash</h1>
            <p className="break-words text-lg leading-8 text-slate-300">
              Controle ganhos, perdas e consistência com uma experiência premium conectada ao Supabase.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-line min-w-0 rounded-lg p-4">
              <strong className="text-2xl text-gain">RLS</strong>
              <p className="mt-1 text-sm text-slate-400">Dados isolados por usuário</p>
            </div>
            <div className="glass-line min-w-0 rounded-lg p-4">
              <strong className="text-2xl text-neon">Flow</strong>
              <p className="mt-1 text-sm text-slate-400">Registro por linguagem natural</p>
            </div>
            <div className="glass-line min-w-0 rounded-lg p-4">
              <strong className="text-2xl text-gold-soft">VIP</strong>
              <p className="mt-1 text-sm text-slate-400">Dashboard responsivo em TSX</p>
            </div>
          </div>
        </div>

        <div className="premium-panel w-full min-w-0 max-w-full p-5 sm:p-6 md:p-8">
          <div className="mb-6 flex rounded-lg border border-white/10 bg-black/20 p-1">
            <button
              className={`min-w-0 flex-1 rounded-lg px-2 py-3 text-xs font-black uppercase sm:px-4 sm:text-sm ${isSignIn ? "bg-gold text-ink" : "text-slate-400"}`}
              type="button"
              onClick={() => setMode("sign-in")}
            >
              Entrar
            </button>
            <button
              className={`min-w-0 flex-1 rounded-lg px-2 py-3 text-xs font-black uppercase sm:px-4 sm:text-sm ${!isSignIn ? "bg-gold text-ink" : "text-slate-400"}`}
              type="button"
              onClick={() => setMode("sign-up")}
            >
              Criar conta
            </button>
          </div>

          <form className="grid gap-4" onSubmit={submit}>
            <label>
              <span>E-mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="seu@email.com" required />
            </label>
            <label>
              <span>Senha de acesso</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-bold normal-case text-slate-400">
                <input className="h-4 w-4" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                Manter acesso
              </label>
              <button className="text-sm font-bold text-gold hover:text-gold-soft" type="button" onClick={recover}>
                Recuperar senha
              </button>
            </div>
            <button className="gold-button" disabled={loading} type="submit">
              {loading ? "Aguarde..." : isSignIn ? "Acessar dashboard" : "Criar conta VIP"}
            </button>
            <p className="break-words text-sm text-slate-400">{message}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
