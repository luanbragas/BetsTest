import { ChangeEvent } from "react";
import { FileDown, FileUp } from "lucide-react";
import type { Bet } from "../../types";
import { formatDate, formatMoney, getBetResult, nextStatus, statusLabel } from "../../lib/format";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
  bets: Bet[];
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onEdit?: (bet: Bet) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  onImport?: (event: ChangeEvent<HTMLInputElement>) => void;
  onExport?: () => void;
  compact?: boolean;
};

export function OperationsTable({
  bets,
  page,
  pageSize = 8,
  onPageChange,
  onEdit,
  onDelete,
  onToggle,
  onImport,
  onExport,
  compact = false
}: Props) {
  const totalPages = Math.max(1, Math.ceil(bets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = bets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="overflow-hidden">
      {(onImport || onExport) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <p className="font-display text-sm font-black uppercase text-slate-500">Ultimas operacoes</p>
          </div>
          <div className="flex gap-2">
            {onImport && (
              <label className="ghost-button inline-flex cursor-pointer items-center gap-2">
                <FileUp className="h-4 w-4" />
                Importar
                <input className="hidden" type="file" accept=".csv,text/csv" onChange={onImport} />
              </label>
            )}
            {onExport && (
              <Button variant="ghost" type="button" onClick={onExport}>
                <FileDown className="h-4 w-4" />
                Exportar
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="border-b border-white/10 text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="p-4">Plataforma</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Data</th>
              {!compact && <th className="p-4">Horario</th>}
              <th className="p-4">Investido</th>
              <th className="p-4">Final</th>
              <th className="p-4">Resultado</th>
              {(onEdit || onDelete || onToggle) && <th className="p-4">Acoes</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {!rows.length && <tr><td colSpan={8} className="p-10 text-center text-slate-500">Nenhuma operacao registrada neste periodo.</td></tr>}
            {rows.map((bet) => {
              const result = getBetResult(bet);
              return (
                <tr className="text-sm font-bold text-slate-300" key={bet.id}>
                  <td className="p-4">{bet.platform}</td>
                  <td className="p-4">{bet.category}</td>
                  <td className="p-4">{formatDate(bet.date)}</td>
                  {!compact && <td className="p-4">{bet.time}</td>}
                  <td className="p-4">{formatMoney(bet.stake)}</td>
                  <td className="p-4">{formatMoney(bet.returnValue)}</td>
                  <td className={`p-4 ${result >= 0 ? "text-gain" : "text-danger"}`}>{formatMoney(result)}</td>
                  {(onEdit || onDelete || onToggle) && (
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {onEdit && <button className="table-action" type="button" onClick={() => onEdit(bet)}>Editar</button>}
                        {onToggle && <button className="table-action" type="button" onClick={() => onToggle(bet.id)}>{statusLabel(nextStatus(bet.status))}</button>}
                        {onDelete && <button className="table-action" type="button" onClick={() => onDelete(bet.id)}>Excluir</button>}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {!rows.length && <p className="py-8 text-center text-sm text-slate-500">Nenhuma operacao registrada neste periodo.</p>}
        {rows.map((bet) => {
          const result = getBetResult(bet);
          return (
            <article className="rounded-lg border border-white/10 bg-white/[0.03] p-4" key={bet.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-100">{bet.platform}</h3>
                  <p className="text-xs text-slate-500">{bet.category} - {formatDate(bet.date)} - {bet.time}</p>
                </div>
                <strong className={result >= 0 ? "text-gain" : "text-danger"}>{formatMoney(result)}</strong>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span className="rounded-lg bg-black/20 p-2 text-slate-400">Investido<br /><b className="text-slate-100">{formatMoney(bet.stake)}</b></span>
                <span className="rounded-lg bg-black/20 p-2 text-slate-400">Final<br /><b className="text-slate-100">{formatMoney(bet.returnValue)}</b></span>
              </div>
              {(onEdit || onDelete || onToggle) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {onEdit && <button className="table-action" type="button" onClick={() => onEdit(bet)}>Editar</button>}
                  {onToggle && <button className="table-action" type="button" onClick={() => onToggle(bet.id)}>{statusLabel(nextStatus(bet.status))}</button>}
                  {onDelete && <button className="table-action" type="button" onClick={() => onDelete(bet.id)}>Excluir</button>}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4 text-sm font-bold text-slate-500">
        <span>Pagina {currentPage} de {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="ghost" type="button" disabled={currentPage <= 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))}>Anterior</Button>
          <Button variant="ghost" type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>Proxima</Button>
        </div>
      </div>
    </Card>
  );
}
