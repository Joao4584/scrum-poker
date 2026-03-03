import { useI18n } from "@/locales/client";
import { cn } from "@/modules/shared/utils/cn";
import type { PlanningQuestion } from "../../services/get-room-questions";
import { QuestionCardMetrics } from "./question-card-metrics";
import { QuestionCardVotersPreview } from "./question-card-voters-preview";

type QuestionCardHeaderProps = {
  question: PlanningQuestion;
  index: number;
  formattedAverage: string;
};

export function QuestionCardHeader(props: QuestionCardHeaderProps) {
  const t = useI18n();
  const { question, index, formattedAverage } = props;

  return (
    <div className="flex w-full items-start justify-between gap-3.5 text-left">
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full border border-slate-300 bg-white/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            {question.is_active ? t("planning.panel.questionStatus.active") : t("planning.panel.questionStatus.closed", { index: index + 1 })}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
              question.revealed
                ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                : "border border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-200",
            )}
          >
            {question.revealed ? t("planning.panel.revealedStatus.revealed") : t("planning.panel.revealedStatus.hidden")}
          </span>
        </div>

        <div className="space-y-2.5">
          <p className={cn("line-clamp-2 text-sm", question.is_active ? "font-semibold text-slate-900 dark:text-slate-50" : "font-medium text-slate-700 dark:text-slate-200")}>
            {question.text}
          </p>
          <QuestionCardVotersPreview voters={question.voters} />
        </div>
      </div>

      <QuestionCardMetrics votesCount={question.votes_count} formattedAverage={question.revealed ? formattedAverage : "-"} />
    </div>
  );
}
