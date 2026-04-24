import { BarChart3, Bot, Home, List, LogOut, PlusCircle, Shield, Trophy, Users } from "lucide-react";
import { Button } from "../ui/button";
import type { AppPage } from "../../types";
import { cn } from "../../lib/utils";

type Props = {
  activePage: AppPage;
  userName: string;
  isAdmin?: boolean;
  onPageChange: (page: AppPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

const navItems: { page: AppPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { page: "dashboard", label: "Dashboard", icon: Home },
  { page: "new", label: "Nova Aposta", icon: PlusCircle },
  { page: "flow", label: "Flow", icon: Bot },
  { page: "operations", label: "Operacoes", icon: List },
  { page: "performance", label: "Desempenho", icon: BarChart3 },
  { page: "friends", label: "Amigos", icon: Users },
  { page: "admin", label: "Admin", icon: Shield }
];

export function AppLayout({ activePage, userName, isAdmin = false, onPageChange, onLogout, children }: Props) {
  const visibleItems = navItems.filter((item) => item.page !== "admin" || isAdmin);

  return (
    <section className="app-shell min-h-screen pb-24 text-slate-100 md:pb-0 md:pl-64">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orbital-glow" />
        <div className="aurora aurora-gold" />
        <div className="aurora aurora-neon" />
        <div className="aurora aurora-rose" />
        <div className="aurora aurora-deep" />
        <div className="grid-haze" />
        <div className="noise-haze" />
      </div>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/5 bg-[#08111da8] px-4 py-7 backdrop-blur-3xl md:flex md:flex-col">
        <div className="mb-14 flex items-center gap-3 px-2">
          <Trophy className="h-8 w-8 text-gold" />
          <span className="font-display text-xl font-black text-gold-soft">WililiDash</span>
        </div>

        <nav className="grid gap-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = item.page === activePage;
            return (
              <button
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl border px-4 text-left text-sm font-bold transition backdrop-blur",
                  active ? "border-gold/15 bg-white/[0.07] text-gold shadow-glow" : "border-transparent text-slate-400 hover:border-white/5 hover:bg-white/[0.045] hover:text-slate-200"
                )}
                key={item.page}
                type="button"
                onClick={() => onPageChange(item.page)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/5 pt-5">
          <p className="px-3 text-sm text-slate-500">Ola,</p>
          <p className="mb-5 px-3 text-sm font-black text-gold">{userName}</p>
          <Button className="w-full justify-start" variant="ghost" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="mx-auto min-h-screen w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 md:px-10 md:py-9">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex gap-1 overflow-x-auto border-t border-white/5 bg-[#08111da8] px-2 py-2 backdrop-blur-3xl md:hidden">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = item.page === activePage;
          return (
            <button
              className={cn(
                "grid min-w-20 flex-1 justify-items-center gap-1 rounded-xl px-1 py-2 text-[0.68rem] font-black",
                active ? "bg-gold/12 text-gold" : "text-slate-500"
              )}
              key={item.page}
              type="button"
              onClick={() => onPageChange(item.page)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="max-w-full truncate">{item.label.replace("Nova ", "")}</span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
