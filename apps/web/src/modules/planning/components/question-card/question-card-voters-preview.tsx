import { useI18n } from "@/locales/client";
import { formatDisplayName } from "@/modules/shared/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";
import type { PlanningQuestion } from "../../services/get-room-questions";

type QuestionCardVotersPreviewProps = {
  voters: PlanningQuestion["voters"];
};

export function QuestionCardVotersPreview(props: QuestionCardVotersPreviewProps) {
  const t = useI18n();

  if (props.voters.length === 0) {
    return (
      <div className="rounded-full border border-dashed border-slate-300 bg-white/55 px-2.5 py-1 text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
        {t("planning.panel.noVotes")}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {props.voters.slice(0, 4).map((voter, voterIndex) => (
          <Avatar key={`${voter.public_id}-${voterIndex}`} className="h-7 w-7 border-2 border-white shadow-sm dark:border-slate-950">
            {voter.avatar_url ? <AvatarImage src={voter.avatar_url} alt={voter.name} /> : null}
            <AvatarFallback className="bg-slate-200 text-[9px] text-slate-700 dark:bg-slate-700 dark:text-slate-100">
              {(formatDisplayName(voter.name) ?? voter.name).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
