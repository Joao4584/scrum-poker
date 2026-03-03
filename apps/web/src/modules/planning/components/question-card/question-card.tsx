import { useCurrentLocale } from "@/locales/client";
import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { cn } from "@/modules/shared/utils/cn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/shared/ui/accordion";
import type { PlanningQuestion } from "../../services/get-room-questions";
import { getVotingSummary } from "../../utils/voting-summary";
import { QuestionCardContent } from "./question-card-content";
import { QuestionCardHeader } from "./question-card-header";

type QuestionCardProps = {
  question: PlanningQuestion;
  index: number;
  votingScale: VotingScale | null;
  currentUserPublicId: string | null;
  isDeleting: boolean;
  isFinishing: boolean;
  isVoting: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onVote: (questionPublicId: string, value: string) => void;
  onDelete: (questionPublicId: string) => void;
  onFinish: (questionPublicId: string) => void;
};

function formatQuestionAverage(locale: string, question: PlanningQuestion, votingScale: VotingScale | null) {
  const votingSummary = getVotingSummary({
    votingScale,
    voters: question.voters,
  });

  if (!question.revealed || votingSummary.average === null) {
    return "-";
  }

  return new Intl.NumberFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(votingSummary.average);
}

function formatQuestionFinishedAt(locale: string, question: PlanningQuestion) {
  if (question.is_active) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(question.updated_at));
}

export function QuestionCard(props: QuestionCardProps) {
  const locale = useCurrentLocale();
  const { question } = props;
  const formattedAverage = formatQuestionAverage(locale, question, props.votingScale);
  const formattedFinishedAt = formatQuestionFinishedAt(locale, question);

  return (
    <Accordion
      type="single"
      collapsible
      value={props.isOpen ? question.public_id : ""}
      onValueChange={(value) => props.onOpenChange(value === question.public_id)}
      className={cn(
        "overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm",
        question.is_active
          ? "border-cyan-400/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(255,255,255,0.96))] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.92))]"
          : "border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.95))] dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))]",
      )}
    >
      <AccordionItem value={question.public_id} className="border-none">
        <AccordionTrigger className="px-3.5 py-3.5 hover:no-underline">
          <QuestionCardHeader question={question} index={props.index} formattedAverage={formattedAverage} />
        </AccordionTrigger>

        <AccordionContent className="px-3.5 pb-3.5 pt-0">
          <QuestionCardContent
            question={question}
            votingScale={props.votingScale}
            currentUserPublicId={props.currentUserPublicId}
            formattedFinishedAt={formattedFinishedAt}
            isDeleting={props.isDeleting}
            isFinishing={props.isFinishing}
            isVoting={props.isVoting}
            onVote={props.onVote}
            onDelete={() => props.onDelete(question.public_id)}
            onFinish={() => props.onFinish(question.public_id)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
