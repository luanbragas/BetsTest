import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Bet, BetPayload, BetStatus } from "../../types";
import { cleanName, formatMoney, getBetResult, stripClientFields } from "../../lib/format";
import { emptyBet } from "../../lib/bets";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

type Props = {
  editingBet?: Bet | null;
  onCancel?: () => void;
  onSubmit: (bet: BetPayload) => Promise<void>;
};

const platforms = ["Betano", "PixBet", "Bet365", "Betboom", "Sportingbet", "KTO", "Superbet", "Novibet", "Stake"];
const categories = ["Geral", "Futebol", "Basquete", "Tenis", "Multipla", "Ao vivo", "Outro"];

export function BetForm({ editingBet, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<BetPayload>(() => emptyBet());
  const [loading, setLoading] = useState(false);
  const result = useMemo(() => getBetResult(form), [form]);

  useEffect(() => {
    setForm(editingBet ? stripClientFields(editingBet) : emptyBet());
  }, [editingBet]);

  function update<K extends keyof BetPayload>(key: K, value: BetPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ ...form, platform: cleanName(form.platform) });
      setForm(emptyBet());
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <form className="grid gap-5" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span>Plataforma</span>
            <Select value={form.platform || undefined} onValueChange={(platform) => update("platform", platform)}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => <SelectItem key={platform} value={platform}>{platform}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>

          <label>
            <span>Categoria</span>
            <Select value={form.category} onValueChange={(category) => update("category", category)}>
              <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label><span>Data</span><Input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} required /></label>
          <label><span>Horario</span><Input type="time" value={form.time} onChange={(event) => update("time", event.target.value)} required /></label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label><span>Valor investido (R$)</span><Input type="number" min="0" step="0.01" value={form.stake} onChange={(event) => update("stake", Number(event.target.value || 0))} required /></label>
          <label><span>Valor final (R$)</span><Input type="number" min="0" step="0.01" value={form.returnValue} onChange={(event) => update("returnValue", Number(event.target.value || 0))} required /></label>
          <label>
            <span>Resultado</span>
            <Select value={form.status} onValueChange={(status) => update("status", status as BetStatus)}>
              <SelectTrigger><SelectValue placeholder="Resultado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="win">Ganhou</SelectItem>
                <SelectItem value="loss">Perdeu</SelectItem>
                <SelectItem value="push">Empatou</SelectItem>
                <SelectItem value="open">Aberta</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black">
          <span className="text-slate-500">Resultado previsto</span>
          <strong className={`break-words text-lg ${result >= 0 ? "text-gain" : "text-danger"}`}>{formatMoney(result)}</strong>
        </div>

        <label><span>Observacoes</span><Textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={3} placeholder="Odd, estrategia, campeonato..." /></label>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button disabled={loading || !form.platform} type="submit">{loading ? "Salvando..." : editingBet ? "Atualizar aposta" : "Registrar aposta"}</Button>
          {editingBet && onCancel && <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>}
        </div>
      </form>
    </Card>
  );
}
