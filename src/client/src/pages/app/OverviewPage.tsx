import { PlusCircle } from "lucide-react";
import type { AppPage, Bet, FilterState, Totals } from "../../types";
import { MetricStrip } from "../../components/bets/MetricStrip";
import { FilterBar } from "../../components/bets/FilterBar";
import { OperationsTable } from "../../components/bets/OperationsTable";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/button";

type Props = {
  userName: string;
  bets: Bet[];
  page: number;
  filters: FilterState;
  totals: Totals;
  platforms: string[];
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: FilterState) => void;
  onNavigate: (page: AppPage) => void;
};

export function OverviewPage({ userName, bets, page, filters, totals, platforms, onPageChange, onFiltersChange, onNavigate }: Props) {
  return (
    <div>
      <PageHeader
        eyebrow="Visao geral"
        title={`Ola, ${userName}`}
        subtitle={totals.bestPlatform ? `${totals.bestPlatform} lidera o periodo.` : "Registre uma operacao para iniciar o periodo."}
        actions={<Button type="button" onClick={() => onNavigate("new")}><PlusCircle className="h-4 w-4" /> Nova aposta</Button>}
      />
      <div className="grid gap-6">
        <FilterBar filters={filters} platforms={platforms} onChange={onFiltersChange} compact />
        <MetricStrip totals={totals} count={bets.length} />
        <OperationsTable bets={bets} page={page} pageSize={5} onPageChange={onPageChange} compact />
      </div>
    </div>
  );
}
