import { FormEvent, useState } from "react";
import { Bot, Send } from "lucide-react";
import type { Bet } from "../../types";
import { formatMoney, getBetResult } from "../../lib/format";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

type Props = {
  onSubmit: (text: string) => Promise<Bet>;
};

const suggestions = [
  "Depositei 120 e saquei 185 na Betano hoje",
  "Perdi 50 reais na PixBet ontem",
  "Ganhei 200 na Bet365 hoje",
  "Aposta de 30 virou 74 na Betboom"
];

export function SmartFlow({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("Escreva valor, plataforma e quando aconteceu.");
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    try {
      const created = await onSubmit(text.trim());
      setText("");
      setState("success");
      setResult(`Registrado em ${created.platform}: resultado ${formatMoney(getBetResult(created))}.`);
    } catch (error) {
      setState("error");
      setResult(error instanceof Error ? error.message : "Nao foi possivel registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-xl font-black text-gold-soft">WililiFlow</p>
          <p className="text-sm text-slate-400">Transforme uma frase em operacao organizada.</p>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={submit}>
        <label>
          <span>Registro inteligente</span>
          <Textarea rows={6} value={text} onChange={(event) => setText(event.target.value)} placeholder="Ex.: Depositei 120 e saquei 185 na Betano hoje" />
        </label>
        <Button disabled={loading || !text.trim()} type="submit">
          <Send className="h-4 w-4" />
          {loading ? "Registrando..." : "Registrar automaticamente"}
        </Button>
      </form>

      <div className={`mt-5 rounded-lg border p-4 text-sm ${state === "success" ? "border-gain/20 bg-gain/5 text-slate-100" : state === "error" ? "border-danger/20 bg-danger/5 text-slate-100" : "border-neon/20 bg-neon/5 text-slate-300"}`}>
        {result}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-left text-sm font-bold text-slate-300 hover:border-gold/30 hover:text-gold-soft"
            key={suggestion}
            type="button"
            onClick={() => setText(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </Card>
  );
}
