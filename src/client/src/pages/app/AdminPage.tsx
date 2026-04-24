import { FormEvent, useState } from "react";
import { Building2, ShieldCheck, ShieldPlus, Trash2, UserPlus, Users2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { PageHeader } from "../../components/layout/PageHeader";
import type { AdminUser } from "../../types";
import { defaultPlatforms } from "../../lib/platforms";

type Props = {
  platforms: string[];
  canManageAdmins: boolean;
  admins: AdminUser[];
  onAddAdmin: (email: string) => Promise<void>;
  onRemoveAdmin: (email: string) => Promise<void>;
  onCreatePlatform: (name: string) => Promise<void>;
  onDeletePlatform: (name: string) => Promise<void>;
};

export function AdminPage({ platforms, canManageAdmins, admins, onAddAdmin, onRemoveAdmin, onCreatePlatform, onDeletePlatform }: Props) {
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [savingPlatform, setSavingPlatform] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [removingEmail, setRemovingEmail] = useState("");
  const [removingPlatform, setRemovingPlatform] = useState("");
  const customPlatforms = platforms.filter((platform) => !defaultPlatforms.includes(platform));

  async function submitPlatform(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSavingPlatform(true);
    try {
      await onCreatePlatform(name.trim());
      setName("");
    } finally {
      setSavingPlatform(false);
    }
  }

  async function submitAdmin(event: FormEvent) {
    event.preventDefault();
    const clean = adminEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return;

    setSavingAdmin(true);
    try {
      await onAddAdmin(clean);
      setAdminEmail("");
    } finally {
      setSavingAdmin(false);
    }
  }

  async function removeAdmin(email: string) {
    setRemovingEmail(email);
    try {
      await onRemoveAdmin(email);
    } finally {
      setRemovingEmail("");
    }
  }

  async function removePlatform(name: string) {
    setRemovingPlatform(name);
    try {
      await onDeletePlatform(name);
    } finally {
      setRemovingPlatform("");
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Casas e permissoes" subtitle="Controle quem acessa o painel e organize as casas exibidas no sistema." />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Card className="min-h-28 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Admins ativos</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <strong className="text-3xl font-black text-gold-soft">{admins.length || 1}</strong>
            <Users2 className="h-8 w-8 text-neon/70" />
          </div>
        </Card>
        <Card className="min-h-28 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Casas totais</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <strong className="text-3xl font-black text-gold-soft">{platforms.length}</strong>
            <Building2 className="h-8 w-8 text-gold/80" />
          </div>
        </Card>
        <Card className="min-h-28 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Casas custom</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <strong className="text-3xl font-black text-gold-soft">{customPlatforms.length}</strong>
            <ShieldCheck className="h-8 w-8 text-gain/80" />
          </div>
        </Card>
      </div>

      {canManageAdmins && (
        <div className="mb-5 grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <Card className="p-4 sm:p-6">
            <form className="grid gap-4" onSubmit={submitAdmin}>
              <label>
                <span>E-mail com acesso admin</span>
                <Input value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} placeholder="admin@email.com" inputMode="email" />
              </label>
              <Button disabled={savingAdmin || !adminEmail.trim()} type="submit">
                <UserPlus className="h-4 w-4" />
                {savingAdmin ? "Salvando..." : "Liberar admin"}
              </Button>
            </form>
          </Card>

          <Card className="min-w-0 p-4 sm:p-5">
            <p className="mb-3 font-display text-sm font-black uppercase text-slate-500">Quem tem acesso</p>
            <div className="grid gap-3">
              {admins.map((admin) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3" key={admin.email}>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-black text-gold-soft">{admin.email}</p>
                    <p className="text-xs text-slate-500">{admin.isOwner ? "Dono principal" : "Admin liberado por voce"}</p>
                  </div>

                  {admin.isOwner ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-black uppercase text-gold-soft">
                      <ShieldCheck className="h-4 w-4" />
                      Dono
                    </span>
                  ) : (
                    <button
                      className="table-action px-2"
                      type="button"
                      aria-label={`Remover admin ${admin.email}`}
                      onClick={() => removeAdmin(admin.email)}
                      disabled={removingEmail === admin.email}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
        <Card className="p-4 sm:p-6">
          <form className="grid gap-4" onSubmit={submitPlatform}>
            <label>
              <span>Nome da casa</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Betnacional" maxLength={40} />
            </label>
            <Button disabled={savingPlatform || !name.trim()} type="submit">
              <ShieldPlus className="h-4 w-4" />
              {savingPlatform ? "Salvando..." : "Adicionar casa"}
            </Button>
          </form>
        </Card>

        <Card className="min-w-0 p-4 sm:p-5">
          <p className="mb-3 font-display text-sm font-black uppercase text-slate-500">Casas cadastradas</p>
          <div className="grid gap-3">
            {platforms.map((platform) => {
              const fixed = defaultPlatforms.includes(platform);
              return (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3" key={platform}>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-black text-slate-100">{platform}</p>
                    <p className="text-xs text-slate-500">{fixed ? "Padrao do sistema" : "Casa adicionada no admin"}</p>
                  </div>

                  {fixed ? (
                    <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[0.68rem] font-black uppercase text-slate-400">Fixa</span>
                  ) : (
                    <button
                      className="table-action px-2"
                      type="button"
                      aria-label={`Remover casa ${platform}`}
                      onClick={() => removePlatform(platform)}
                      disabled={removingPlatform === platform}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
