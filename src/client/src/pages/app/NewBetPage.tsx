import type { Bet, BetPayload } from "../../types";
import { BetForm } from "../../components/bets/BetForm";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  editingBet: Bet | null;
  onCancelEdit: () => void;
  onSubmit: (bet: BetPayload) => Promise<void>;
};

export function NewBetPage({ editingBet, onCancelEdit, onSubmit }: Props) {
  return (
    <div>
      <PageHeader eyebrow="Registrar" title={editingBet ? "Editar Aposta" : "Nova Aposta"} />
      <BetForm editingBet={editingBet} onCancel={onCancelEdit} onSubmit={onSubmit} />
    </div>
  );
}
