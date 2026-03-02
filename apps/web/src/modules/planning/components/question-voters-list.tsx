import { useI18n } from "@/locales/client";
import { formatDisplayName, toBRFormat } from "@/modules/shared/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";
import type { PlanningQuestion } from "../services/get-room-questions";

type QuestionVotersListProps = {
  voters: PlanningQuestion["voters"];
  revealed: boolean;
};

export function QuestionVotersList(props: QuestionVotersListProps) {
  const t = useI18n();
  const visibleVoters = props.voters.slice(0, 5);

  if (props.voters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-950/40">
        <p className="text-xs text-slate-500 dark:text-slate-400">{t("planning.panel.noVotes")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300/80 pb-2 dark:border-slate-800/80">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
          {t("planning.panel.votersSectionTitle", { count: props.voters.length })}
        </p>
        {props.voters.length > 5 ? (
          <span className="rounded-full border border-slate-300 bg-white/85 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            {t("planning.panel.moreVoters", { count: props.voters.length - 5 })}
          </span>
        ) : null}
      </div>

      <div className="grid gap-2.5">
        {visibleVoters.map((voter, voterIndex) => (
          <div
            key={`${voter.public_id}-${voterIndex}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2.5 dark:border-slate-800/90 dark:bg-slate-950/70"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-300 ring-1 ring-slate-200 dark:border-slate-700/80 dark:ring-slate-800">
                {voter.avatar_url ? <AvatarImage src={voter.avatar_url} alt={voter.name} /> : null}
                <AvatarFallback className="bg-slate-200 text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                  {(formatDisplayName(voter.name) ?? voter.name).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{formatDisplayName(voter.name) ?? voter.name}</p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{toBRFormat(voter.voted_at)}</p>
              </div>
            </div>
            <div className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white/90 px-3 dark:border-slate-700/80 dark:bg-slate-900/90">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{props.revealed ? voter.value : t("planning.panel.hiddenVote")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
