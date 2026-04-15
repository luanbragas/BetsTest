import { BarChart3, Bot, Home, List, LogOut, PlusCircle, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import type { AppPage } from "../../types";
import { cn } from "../../lib/utils";

type Props = {
  activePage: AppPage;
  userName: string;
  onPageChange: (page: AppPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

const navItems: { page: AppPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { page: "dashboard", label: "Dashboard", icon: Home },
  { page: "new", label: "Nova Aposta", icon: PlusCircle },
  { page: "flow", label: "Flow", icon: Bot },
  { page: "operations", label: "Operacoes", icon: List },
  { page: "performance", label: "Desempenho", icon: BarChart3 }
];

export function AppLayout({ activePage, userName, onPageChange, onLogout, children }: Props) {
  return (
    <section className="min-h-screen bg-[#070b14] pb-24 text-slate-100 md:pb-0 md:pl-64">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-[#0b111f] px-4 py-7 md:flex md:flex-col">
        <div className="mb-14 flex items-center gap-3 px-2">
          <Trophy className="h-8 w-8 text-gold" />
          <span className="font-display text-xl font-black text-gold-soft">WililiDash</span>
        </div>

        <nav className="grid gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.page === activePage;
            return (
              <button
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg border px-4 text-left text-sm font-bold transition",
                  active ? "border-gold/35 bg-gold/10 text-gold" : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-200"
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

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="px-3 text-sm text-slate-500">Ola,</p>
          <p className="mb-5 px-3 text-sm font-black text-gold">{userName}</p>
          <Button className="w-full justify-start" variant="ghost" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10 md:py-9">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 bg-[#0b111f]/95 px-2 py-2 backdrop-blur md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.page === activePage;
          return (
            <button
              className={cn("grid justify-items-center gap-1 rounded-lg px-1 py-2 text-[0.68rem] font-black", active ? "bg-gold/10 text-gold" : "text-slate-500")}
              key={item.page}
              type="button"
              onClick={() => onPageChange(item.page)}
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label.replace("Nova ", "")}</span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
