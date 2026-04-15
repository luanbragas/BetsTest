import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, actions }: Props) {
  return (
    <header className="mb-7 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[0.72rem] font-black uppercase text-gold">{eyebrow}</p>
        <h1 className="mt-2 break-words font-display text-3xl font-black leading-tight text-gold-soft sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl break-words text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap gap-2 sm:w-auto">{actions}</div>}
    </header>
  );
}
