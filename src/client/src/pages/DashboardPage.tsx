import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { createBet, createFlowBet, deleteBet, importBets, listBets, updateBet } from "../lib/api";
import { calculateTotals, defaultFilters, demoBets, filterBets, parseCsv, toCsv, uniqueValues } from "../lib/bets";
import { displayName, nextStatus, stripClientFields } from "../lib/format";
import { AppLayout } from "../components/layout/AppLayout";
import { OverviewPage } from "./app/OverviewPage";
import { NewBetPage } from "./app/NewBetPage";
import { FlowPage } from "./app/FlowPage";
import { OperationsPage } from "./app/OperationsPage";
import { PerformancePage } from "./app/PerformancePage";
import type { AppPage, AuthState, Bet, BetPayload, FilterState, ToastState } from "../types";

type Props = {
  auth: AuthState;
  onLogout: () => void;
  onToast: (toast: ToastState) => void;
};

export function DashboardPage({ auth, onLogout, onToast }: Props) {
  const token = auth.session.access_token;
  const [activePage, setActivePage] = useState<AppPage>("dashboard");
  const [bets, setBets] = useState<Bet[]>([]);
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters());

  useEffect(() => {
    void refresh();
  }, []);

  const platforms = useMemo(() => uniqueValues(bets.map((bet) => bet.platform)), [bets]);
  const categories = useMemo(() => uniqueValues(bets.map((bet) => bet.category)), [bets]);
  const filteredBets = useMemo(() => filterBets(bets, filters), [bets, filters]);
  const totals = useMemo(() => calculateTotals(filteredBets), [filteredBets]);
  const userName = displayName(auth.user.email);

  async function refresh() {
    try {
      setBets(await listBets(token));
      setPage(1);
    } catch (error) {
      handleError(error);
    }
  }

  async function saveBet(payload: BetPayload) {
    try {
      if (editingBet) {
        const updated = await updateBet(token, editingBet.id, payload);
        setBets((current) => current.map((bet) => (bet.id === updated.id ? updated : bet)));
        setEditingBet(null);
        setActivePage("operations");
        onToast({ message: "Operacao atualizada.", type: "success" });
        return;
      }

      const created = await createBet(token, payload);
      setBets((current) => [created, ...current]);
      setActivePage("dashboard");
      onToast({ message: "Operacao salva.", type: "success" });
    } catch (error) {
      handleError(error);
    }
  }

  async function saveFlow(text: string) {
    try {
      const created = await createFlowBet(token, text);
      setBets((current) => [created, ...current]);
      onToast({ message: "Flow registrado com sucesso.", type: "success" });
      return created;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  function editBet(bet: Bet) {
    setEditingBet(bet);
    setActivePage("new");
  }

  async function removeBet(id: string) {
    const bet = bets.find((item) => item.id === id);
    if (!bet || !window.confirm(`Excluir a operacao da ${bet.platform}?`)) return;

    try {
      await deleteBet(token, id);
      setBets((current) => current.filter((item) => item.id !== id));
      onToast({ message: "Operacao excluida.", type: "success" });
    } catch (error) {
      handleError(error);
    }
  }

  async function toggleStatus(id: string) {
    const bet = bets.find((item) => item.id === id);
    if (!bet) return;

    const status = nextStatus(bet.status);
    const nextBet: Bet = { ...bet, status };
    if (status === "loss") nextBet.returnValue = 0;
    if (status === "push") nextBet.returnValue = nextBet.stake;

    try {
      const updated = await updateBet(token, id, stripClientFields(nextBet));
      setBets((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      handleError(error);
    }
  }

  async function addDemo() {
    try {
      const created = await importBets(token, demoBets());
      setBets((current) => [...created, ...current]);
      onToast({ message: "Dados de demonstracao adicionados.", type: "success" });
    } catch (error) {
      handleError(error);
    }
  }

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const created = await importBets(token, parseCsv(await file.text()));
      setBets((current) => [...created, ...current]);
      onToast({ message: "CSV importado.", type: "success" });
    } catch (error) {
      handleError(error);
    } finally {
      event.target.value = "";
    }
  }

  function exportCsv() {
    const blob = new Blob([toCsv(filteredBets)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wilili-dash-operacoes.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function changeFilters(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

  function handleError(error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    onToast({ message, type: "error" });
    if (/sessao|sessão|session|unauthorized/i.test(message)) onLogout();
  }

  function renderPage() {
    if (activePage === "new") {
      return <NewBetPage editingBet={editingBet} onCancelEdit={() => setEditingBet(null)} onSubmit={saveBet} />;
    }

    if (activePage === "flow") {
      return <FlowPage onSubmit={saveFlow} />;
    }

    if (activePage === "operations") {
      return (
        <OperationsPage
          bets={filteredBets}
          page={page}
          filters={filters}
          totals={totals}
          platforms={platforms}
          categories={categories}
          onPageChange={setPage}
          onFiltersChange={changeFilters}
          onEdit={editBet}
          onDelete={removeBet}
          onToggle={toggleStatus}
          onImport={importCsv}
          onExport={exportCsv}
        />
      );
    }

    if (activePage === "performance") {
      return <PerformancePage bets={filteredBets} filters={filters} totals={totals} platforms={platforms} onFiltersChange={changeFilters} />;
    }

    return (
      <OverviewPage
        userName={userName}
        bets={filteredBets}
        page={page}
        filters={filters}
        totals={totals}
        platforms={platforms}
        onPageChange={setPage}
        onFiltersChange={changeFilters}
        onNavigate={setActivePage}
      />
    );
  }

  return (
    <AppLayout activePage={activePage} userName={userName} onPageChange={setActivePage} onLogout={onLogout}>
      <div className="mb-4 flex justify-end">
        <button className="text-xs font-black uppercase text-slate-500 hover:text-gold" type="button" onClick={addDemo}>
          Adicionar demo
        </button>
      </div>
      {renderPage()}
    </AppLayout>
  );
}
