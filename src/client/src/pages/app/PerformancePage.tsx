import type { Bet, FilterState, Totals } from "../../types";
import { FilterBar } from "../../components/bets/FilterBar";
import { MetricStrip } from "../../components/bets/MetricStrip";
import { PerformanceChart } from "../../components/bets/PerformanceChart";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  bets: Bet[];
  filters: FilterState;
  totals: Totals;
  platforms: string[];
  onFiltersChange: (filters: FilterState) => void;
};

export function PerformancePage({ bets, filters, totals, platforms, onFiltersChange }: Props) {
  return (
    <div>
      <PageHeader eyebrow="Analise" title="Desempenho" />
      <div className="grid gap-6">
        <FilterBar filters={filters} platforms={platforms} onChange={onFiltersChange} compact />
        <MetricStrip totals={totals} count={bets.length} variant="performance" />
        <PerformanceChart bets={bets} />
      </div>
    </div>
  );
}
