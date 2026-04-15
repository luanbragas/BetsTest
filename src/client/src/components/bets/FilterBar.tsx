import type { FilterState, Period } from "../../types";
import { defaultFilters } from "../../lib/bets";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

type Props = {
  filters: FilterState;
  platforms?: string[];
  categories?: string[];
  onChange: (filters: FilterState) => void;
  compact?: boolean;
};

export function FilterBar({ filters, platforms = [], categories = [], onChange, compact = false }: Props) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <section className={`grid w-full min-w-0 gap-3 ${compact ? "grid-cols-1 sm:flex sm:flex-wrap" : "grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap"}`}>
      <SegmentedPeriod value={filters.period} onChange={(period) => update({ period })} />

      {filters.period === "custom" && (
        <>
          <Input value={filters.customStart} onChange={(event) => update({ customStart: event.target.value })} type="date" />
          <Input value={filters.customEnd} onChange={(event) => update({ customEnd: event.target.value })} type="date" />
        </>
      )}

      <div className="min-w-0 sm:min-w-48">
        <Select value={filters.platform} onValueChange={(platform) => update({ platform })}>
          <SelectTrigger><SelectValue placeholder="Todas as Plataformas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Plataformas</SelectItem>
            {platforms.map((platform) => <SelectItem key={platform} value={platform}>{platform}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div className="min-w-0 sm:min-w-44">
          <Select value={filters.category} onValueChange={(category) => update({ category })}>
            <SelectTrigger><SelectValue placeholder="Todas Categorias" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button className="w-full min-w-0 sm:w-auto sm:min-w-24" variant="ghost" type="button" onClick={() => onChange(defaultFilters())}>Limpar</Button>
    </section>
  );
}

function SegmentedPeriod({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  const items: { value: Period; label: string }[] = [
    { value: "day", label: "Hoje" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mes" },
    { value: "all", label: "Tudo" }
  ];

  return (
    <div className="grid min-w-0 grid-cols-4 gap-1 sm:flex sm:gap-2">
      {items.map((item) => (
        <button
          className={`min-h-11 min-w-0 rounded-lg border px-2 text-xs font-bold sm:px-4 sm:text-sm ${value === item.value ? "border-gold/35 bg-gold/10 text-gold" : "border-transparent bg-white/[0.04] text-slate-400"}`}
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
