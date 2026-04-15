import type { Bet } from "../../types";
import { SmartFlow } from "../../components/bets/SmartFlow";
import { PageHeader } from "../../components/layout/PageHeader";

type Props = {
  onSubmit: (text: string) => Promise<Bet>;
};

export function FlowPage({ onSubmit }: Props) {
  return (
    <div>
      <PageHeader
        eyebrow="Registro inteligente"
        title="WililiFlow"
        subtitle="Escreva do jeito que voce falaria. O sistema identifica valores, plataforma, data e resultado."
      />
      <SmartFlow onSubmit={onSubmit} />
    </div>
  );
}
