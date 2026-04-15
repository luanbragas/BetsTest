import { ChangeEvent } from "react";
import type { Bet, FilterState, Totals } from "../../types";
import { FilterBar } from "../../components/bets/FilterBar";
import { MetricStrip } from "../../components/bets/MetricStrip";
import { OperationsTable } from "../../components/bets/OperationsTable";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  bets: Bet[];
  page: number;
  filters: FilterState;
  totals: Totals;
  platforms: string[];
  categories: string[];
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: FilterState) => void;
  onEdit: (bet: Bet) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
};

export function OperationsPage({ bets, page, filters, totals, platforms, categories, onPageChange, onFiltersChange, onEdit, onDelete, onToggle, onImport, onExport }: Props) {
  return (
    <div>
      <PageHeader eyebrow="Operacoes" title="Todas as Operacoes" />
      <div className="grid gap-6">
        <MetricStrip totals={totals} count={bets.length} variant="operations" />
        <FilterBar filters={filters} platforms={platforms} categories={categories} onChange={onFiltersChange} />
        <OperationsTable bets={bets} page={page} onPageChange={onPageChange} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onImport={onImport} onExport={onExport} />
      </div>
    </div>
  );
}
