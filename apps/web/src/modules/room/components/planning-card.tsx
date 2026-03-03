import { PokerPanel } from "@/modules/planning/components/panel/poker-panel";
import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";

type PlanningCardProps = {
  roomPublicId: string;
  votingScale: VotingScale | null;
};

export function PlanningCard(props: PlanningCardProps) {
  return (
    <div className="absolute right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))]">
      <PokerPanel roomPublicId={props.roomPublicId} votingScale={props.votingScale} />
    </div>
  );
}
