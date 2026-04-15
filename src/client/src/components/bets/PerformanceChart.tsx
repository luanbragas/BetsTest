import { useEffect, useMemo, useRef } from "react";
import { Award } from "lucide-react";
import type { Bet } from "../../types";
import { formatMoney, formatPercent, getBetResult } from "../../lib/format";
import { Card } from "../ui/card";

type Props = {
  bets: Bet[];
};

export function PerformanceChart({ bets }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const platformRows = useMemo(() => platformPerformance(bets), [bets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.floor(260 * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    context.clearRect(0, 0, width, height);
    drawGrid(context, width, height);

    const timeline = buildTimeline(bets);
    if (!timeline.length) {
      context.fillStyle = "#94a3b8";
      context.font = "700 14px Inter, sans-serif";
      context.fillText("Sem dados neste periodo.", 24, height / 2);
      return;
    }

    const values = timeline.map((item) => item.net);
    let min = Math.min(...values, 0);
    let max = Math.max(...values, 0);
    if (min === max) {
      min -= 10;
      max += 10;
    }

    const pad = 24;
    const points = timeline.map((item, index) => ({
      x: pad + (index * (width - pad * 2)) / Math.max(1, timeline.length - 1),
      y: height - pad - ((item.net - min) / (max - min)) * (height - pad * 2)
    }));

    context.beginPath();
    points.forEach((point, index) => (index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)));
    context.strokeStyle = "#2be7ff";
    context.lineWidth = 3;
    context.stroke();
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 4, 0, Math.PI * 2);
      context.fillStyle = "#f1d27b";
      context.fill();
    });
  }, [bets]);

  return (
    <div className="grid gap-5">
      <Card className="p-4 sm:p-5">
        <canvas ref={canvasRef} className="h-64 w-full rounded-lg bg-black/20" height={260} />
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Award className="h-5 w-5 text-gold" />
          <p className="font-display text-sm font-black uppercase text-slate-400">Desempenho por plataforma</p>
        </div>
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-xs font-black uppercase text-slate-500">
              <tr><th className="p-4">Plataforma</th><th className="p-4">Operacoes</th><th className="p-4">Win rate</th><th className="p-4">Resultado</th></tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {!platformRows.length && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Sem dados neste periodo.</td></tr>}
              {platformRows.map((row) => (
                <tr className="text-sm font-bold text-slate-300" key={row.platform}>
                  <td className="p-4">{row.platform}</td>
                  <td className="p-4">{row.count}</td>
                  <td className="p-4 text-gold">{formatPercent(row.hitRate)}</td>
                  <td className={`p-4 ${row.net >= 0 ? "text-gain" : "text-danger"}`}>{formatMoney(row.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 p-3 md:hidden">
          {!platformRows.length && <p className="py-8 text-center text-sm text-slate-500">Sem dados neste periodo.</p>}
          {platformRows.map((row) => (
            <article className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-4" key={row.platform}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-black">{row.platform}</h3>
                  <p className="break-words text-xs text-slate-500">{row.count} operacoes - {formatPercent(row.hitRate)} win rate</p>
                </div>
                <strong className={`max-w-full break-words text-right ${row.net >= 0 ? "text-gain" : "text-danger"}`}>{formatMoney(row.net)}</strong>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}

function platformPerformance(bets: Bet[]) {
  const map = new Map<string, { count: number; wins: number; net: number }>();
  bets.forEach((bet) => {
    const current = map.get(bet.platform) || { count: 0, wins: 0, net: 0 };
    const result = getBetResult(bet);
    current.count += 1;
    current.net += result;
    if (result > 0) current.wins += 1;
    map.set(bet.platform, current);
  });

  return Array.from(map.entries())
    .map(([platform, value]) => ({ platform, ...value, hitRate: value.count ? (value.wins / value.count) * 100 : 0 }))
    .sort((a, b) => b.net - a.net);
}

function buildTimeline(bets: Bet[]): { date: string; net: number }[] {
  const byDate = new Map<string, number>();
  bets
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((bet) => byDate.set(bet.date, (byDate.get(bet.date) || 0) + getBetResult(bet)));

  let cumulative = 0;
  return Array.from(byDate.entries()).map(([date, value]) => {
    cumulative += value;
    return { date, net: cumulative };
  });
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number) {
  context.strokeStyle = "rgba(148, 163, 184, 0.14)";
  context.lineWidth = 1;

  for (let i = 1; i < 5; i += 1) {
    const y = (height / 5) * i;
    context.beginPath();
    context.moveTo(18, y);
    context.lineTo(width - 18, y);
    context.stroke();
  }
}
