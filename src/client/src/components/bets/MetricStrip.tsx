import { Activity, DollarSign, Target, TrendingDown, TrendingUp } from "lucide-react";
import type { Totals } from "../../types";
import { formatMoney, formatPercent } from "../../lib/format";
import { Card } from "../ui/card";

type Props = {
  totals: Totals;
  count: number;
  variant?: "overview" | "operations" | "performance";
};

export function MetricStrip({ totals, count, variant = "overview" }: Props) {
  const cards = variant === "performance"
    ? [
        { label: "Win rate", value: formatPercent(totals.hitRate), color: "text-gold", icon: Target },
        { label: "Lucro medio", value: formatMoney(count ? totals.profit / Math.max(1, count) : 0), color: "text-gain", icon: TrendingUp },
        { label: "Prejuizo medio", value: formatMoney(count ? totals.loss / Math.max(1, count) : 0), color: "text-danger", icon: TrendingDown },
        { label: "Resultado", value: formatMoney(totals.net), color: totals.net >= 0 ? "text-gain" : "text-danger", icon: Activity }
      ]
    : [
        { label: "Lucro total", value: formatMoney(totals.profit), color: "text-gain", icon: TrendingUp },
        { label: "Prejuizo total", value: formatMoney(totals.loss), color: "text-danger", icon: TrendingDown },
        { label: variant === "operations" ? "Resultado total" : "Resultado liquido", value: formatMoney(totals.net), color: totals.net >= 0 ? "text-gain" : "text-danger", icon: DollarSign },
        { label: "Operacoes", value: String(count), color: "text-neon", icon: Activity },
        { label: "Win rate", value: formatPercent(totals.hitRate), color: "text-gold", icon: Target }
      ];

  return (
    <section className={`grid gap-3 ${variant === "performance" ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-5"}`}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card className="min-h-28 p-5" key={card.label}>
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-xs font-black uppercase text-slate-500">{card.label}</span>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <strong className={`mt-4 block text-3xl font-black ${card.color}`}>{card.value}</strong>
            {card.label === "Operacoes" && <small className="text-sm font-bold text-neon">{formatPercent(totals.hitRate)} aproveitamento</small>}
          </Card>
        );
      })}
    </section>
  );
}
