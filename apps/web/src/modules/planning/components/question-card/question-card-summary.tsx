import { useI18n } from "@/locales/client";

type QuestionCardSummaryProps = {
  suggestedValue: string | null;
  formattedFinishedAt: string;
};

export function QuestionCardSummary(props: QuestionCardSummaryProps) {
  const t = useI18n();

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="min-w-0 rounded-xl border border-slate-300/80 bg-white/80 px-2.5 py-2 dark:border-slate-800/90 dark:bg-slate-950/70">
        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{t("planning.panel.summary.reference")}</p>
        <p className="mt-1 truncate text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-50">{props.suggestedValue ?? "-"}</p>
      </div>
      <div className="min-w-0 rounded-xl border border-slate-300/80 bg-white/80 px-2.5 py-2 dark:border-slate-800/90 dark:bg-slate-950/70">
        <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{t("planning.panel.summary.finishedAt")}</p>
        <p className="mt-1 truncate text-xs font-medium text-slate-900 dark:text-slate-50">{props.formattedFinishedAt}</p>
      </div>
    </div>
  );
}
