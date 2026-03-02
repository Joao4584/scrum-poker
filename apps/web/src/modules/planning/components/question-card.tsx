import { useCurrentLocale, useI18n } from "@/locales/client";
import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { formatDisplayName } from "@/modules/shared/utils";
import { cn } from "@/modules/shared/utils/cn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/shared/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";
import type { PlanningQuestion } from "../services/get-room-questions";
import { getVotingDeckValues, getVotingSummary } from "../utils/voting-summary";
import { QuestionCardActions } from "./question-card-actions";
import { QuestionVotersList } from "./question-voters-list";
import { VotingDeck } from "./voting-deck";

type QuestionCardProps = {
  question: PlanningQuestion;
  index: number;
  votingScale: VotingScale | null;
  currentUserPublicId: string | null;
  isDeleting: boolean;
  isFinishing: boolean;
  isVoting: boolean;
  onVote: (questionPublicId: string, value: string) => void;
  onDelete: (questionPublicId: string) => void;
  onFinish: (questionPublicId: string) => void;
};

export function QuestionCard(props: QuestionCardProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const { question, index, votingScale } = props;
  const votingDeckValues = getVotingDeckValues(votingScale);
  const votingSummary = getVotingSummary({
    votingScale,
    voters: question.voters,
  });
  const currentUserVote = props.currentUserPublicId
    ? question.voters.find((voter) => voter.public_id === props.currentUserPublicId)?.value ?? null
    : null;
  const formattedAverage =
    !question.revealed || votingSummary.average === null
      ? "-"
      : new Intl.NumberFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(votingSummary.average);
  const formattedFinishedAt = !question.is_active
    ? new Intl.DateTimeFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(question.updated_at))
    : "-";

  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        "overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm",
        question.is_active
          ? "border-cyan-400/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.92))]"
          : "border-slate-800 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))]",
      )}
    >
      <AccordionItem value={question.public_id} className="border-none">
        <AccordionTrigger className="px-3.5 py-3.5 hover:no-underline">
          <div className="flex w-full items-start justify-between gap-3.5 text-left">
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-300">
                  {question.is_active ? t("planning.panel.questionStatus.active") : t("planning.panel.questionStatus.closed", { index: index + 1 })}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                    question.revealed
                      ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                      : "border border-amber-400/30 bg-amber-500/10 text-amber-200",
                  )}
                >
                  {question.revealed ? t("planning.panel.revealedStatus.revealed") : t("planning.panel.revealedStatus.hidden")}
                </span>
              </div>

              <div className="space-y-2.5">
                <p className={cn("line-clamp-2 text-sm", question.is_active ? "font-semibold text-slate-50" : "font-medium text-slate-200")}>{question.text}</p>
                <div className="flex items-center gap-3">
                  {question.voters.length > 0 ? (
                    <div className="flex -space-x-2">
                      {question.voters.slice(0, 4).map((voter, voterIndex) => (
                        <Avatar key={`${voter.public_id}-${voterIndex}`} className="h-7 w-7 border-2 border-slate-950 shadow-sm">
                          {voter.avatar_url ? <AvatarImage src={voter.avatar_url} alt={voter.name} /> : null}
                          <AvatarFallback className="bg-slate-700 text-[9px] text-slate-100">
                            {(formatDisplayName(voter.name) ?? voter.name).slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-full border border-dashed border-slate-700 bg-slate-900/40 px-2.5 py-1 text-[11px] text-slate-400">
                      {t("planning.panel.noVotes")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-1.5">
              <div className="min-w-[90px] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/65">
                <div className="flex items-center justify-center px-2.5 py-1.5">
                  <p className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-slate-500">
                    <span>{t("planning.panel.votesLabel")}</span>
                    <span className="text-xs font-semibold leading-none text-slate-50 tabular-nums">{question.votes_count}</span>
                  </p>
                </div>
              </div>
              <div className="px-1">
                <p className="text-center text-[8px] uppercase tracking-[0.16em] text-slate-500">{t("planning.panel.summary.average")}</p>
                <p className="mt-0.5 text-center text-xs font-semibold text-cyan-100 tabular-nums">{question.revealed ? formattedAverage : "-"}</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-3.5 pb-3.5 pt-0">
          <div className="space-y-2.5 rounded-xl border border-slate-800/80 bg-slate-950/45 p-2.5">
            {question.is_active && votingDeckValues.length > 0 ? (
              <VotingDeck
                cards={votingDeckValues}
                selectedValue={currentUserVote}
                disabled={props.isVoting}
                onSelect={(value) => props.onVote(question.public_id, value)}
              />
            ) : null}
            {question.revealed ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="min-w-0 rounded-xl border border-slate-800/90 bg-slate-950/70 px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{t("planning.panel.summary.reference")}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-50 tabular-nums">{votingSummary.suggestedValue ?? "-"}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-800/90 bg-slate-950/70 px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{t("planning.panel.summary.finishedAt")}</p>
                  <p className="mt-1 truncate text-xs font-medium text-slate-50">{formattedFinishedAt}</p>
                </div>
              </div>
            ) : null}
            <QuestionVotersList voters={question.voters} revealed={question.revealed} />
            <QuestionCardActions
              canManage={question.is_active}
              isDeleting={props.isDeleting}
              isFinishing={props.isFinishing}
              onDelete={() => props.onDelete(question.public_id)}
              onFinish={() => props.onFinish(question.public_id)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
