import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import type { PlanningQuestion } from "../../services/get-room-questions";
import { getVotingDeckValues, getVotingSummary } from "../../utils/voting-summary";
import { QuestionCardActions } from "./question-card-actions";
import { QuestionCardSummary } from "./question-card-summary";
import { QuestionVotersList } from "./question-voters-list";
import { VotingDeck } from "./voting-deck";

type QuestionCardContentProps = {
  question: PlanningQuestion;
  votingScale: VotingScale | null;
  currentUserPublicId: string | null;
  formattedFinishedAt: string;
  isDeleting: boolean;
  isFinishing: boolean;
  isVoting: boolean;
  onVote: (questionPublicId: string, value: string) => void;
  onDelete: () => void;
  onFinish: () => void;
};

export function QuestionCardContent(props: QuestionCardContentProps) {
  const votingDeckValues = getVotingDeckValues(props.votingScale);
  const votingSummary = getVotingSummary({
    votingScale: props.votingScale,
    voters: props.question.voters,
  });
  const currentUserVote = props.currentUserPublicId
    ? props.question.voters.find((voter) => voter.public_id === props.currentUserPublicId)?.value ?? null
    : null;

  return (
    <div className="space-y-2.5 rounded-xl border border-sky-200/80 bg-white/55 p-2.5 dark:border-slate-800/80 dark:bg-slate-950/45">
      {props.question.is_active && votingDeckValues.length > 0 ? (
        <VotingDeck
          cards={votingDeckValues}
          selectedValue={currentUserVote}
          disabled={props.isVoting}
          onSelect={(value) => props.onVote(props.question.public_id, value)}
        />
      ) : null}

      {props.question.revealed ? (
        <QuestionCardSummary suggestedValue={votingSummary.suggestedValue} formattedFinishedAt={props.formattedFinishedAt} />
      ) : null}

      <QuestionVotersList voters={props.question.voters} revealed={props.question.revealed} />

      <QuestionCardActions
        canManage={props.question.is_active}
        isDeleting={props.isDeleting}
        isFinishing={props.isFinishing}
        onDelete={props.onDelete}
        onFinish={props.onFinish}
      />
    </div>
  );
}
