import { FormEvent, useEffect, useMemo, useState } from "react";
import { MailPlus, RefreshCw, Trash2, UserRoundX } from "lucide-react";
import type { FriendSummary } from "../../types";
import { formatMoney, formatPercent } from "../../lib/format";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  storageKey: string;
  summaries: FriendSummary[];
  onRefresh: (emails: string[]) => Promise<void>;
};

export function FriendsPage({ storageKey, summaries, onRefresh }: Props) {
  const [emails, setEmails] = useState<string[]>(() => loadFriends(storageKey));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const byEmail = useMemo(() => new Map(summaries.map((summary) => [summary.email, summary])), [summaries]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(emails));
    void refresh(emails);
  }, [emails]);

  async function refresh(nextEmails = emails) {
    setLoading(true);
    try {
      await onRefresh(nextEmails);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return;
    setEmails((current) => (current.includes(clean) ? current : [...current, clean]));
    setEmail("");
  }

  function removeFriend(value: string) {
    setEmails((current) => current.filter((item) => item !== value));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Amigos"
        title="Lucro dos amigos"
        subtitle="Veja direto o lucro liquido de cada amigo, com uma leitura mais limpa."
        actions={
          <Button variant="ghost" type="button" onClick={() => refresh()} disabled={loading || !emails.length}>
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <Card className="p-4 sm:p-6">
          <form className="grid gap-4" onSubmit={submit}>
            <label>
              <span>E-mail do amigo</span>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} inputMode="email" placeholder="amigo@email.com" />
            </label>
            <Button disabled={!email.trim()} type="submit">
              <MailPlus className="h-4 w-4" />
              Adicionar amigo
            </Button>
          </form>
        </Card>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {!emails.length && (
            <Card className="grid min-h-48 place-items-center p-6 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
              Adicione um amigo pelo e-mail para acompanhar o lucro liquido dele.
            </Card>
          )}
          {emails.map((item) => {
            const summary = byEmail.get(item);
            return (
              <Card className="min-w-0 overflow-hidden p-4 sm:p-5" key={item}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-display text-lg font-black text-gold-soft">{summary?.name || item}</h3>
                    <p className="break-words text-xs text-slate-500">{item}</p>
                  </div>
                  <button className="table-action px-2" type="button" aria-label="Remover amigo" onClick={() => removeFriend(item)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {!summary?.found ? (
                  <div className="mt-5 rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-slate-300">
                    <UserRoundX className="mb-2 h-4 w-4 text-danger" />
                    Usuario nao encontrado.
                  </div>
                ) : (
                  <>
                    <p className="mt-5 text-[0.7rem] font-black uppercase tracking-[0.22em] text-slate-500">Lucro liquido</p>
                    <strong className={`mt-2 block break-words text-4xl font-black ${summary.net >= 0 ? "text-gain" : "text-danger"}`}>
                      {formatMoney(summary.net)}
                    </strong>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-slate-300">
                        {summary.betCount} apostas
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-gold-soft">
                        Win rate {formatPercent(summary.hitRate)}
                      </span>
                      {summary.bestPlatform && (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-slate-300">
                          Melhor casa {summary.bestPlatform}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function loadFriends(storageKey: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
