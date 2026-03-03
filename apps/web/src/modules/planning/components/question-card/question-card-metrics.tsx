import { useI18n } from "@/locales/client";

type QuestionCardMetricsProps = {
  votesCount: number;
  formattedAverage: string;
};

export function QuestionCardMetrics(props: QuestionCardMetricsProps) {
  const t = useI18n();

  return (
    <div className="shrink-0 space-y-1.5">
      <div className="min-w-[90px] overflow-hidden rounded-xl border border-slate-300/80 bg-white/80 dark:border-slate-700/60 dark:bg-slate-950/65">
        <div className="flex items-center justify-center px-2.5 py-1.5">
          <p className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
            <span>{t("planning.panel.votesLabel")}</span>
            <span className="text-xs font-semibold leading-none text-slate-900 tabular-nums dark:text-slate-50">{props.votesCount}</span>
          </p>
        </div>
      </div>
      <div className="px-1">
        <p className="text-center text-[8px] uppercase tracking-[0.16em] text-slate-500">{t("planning.panel.summary.average")}</p>
        <p className="mt-0.5 text-center text-xs font-semibold text-cyan-700 tabular-nums dark:text-cyan-100">{props.formattedAverage}</p>
      </div>
    </div>
  );
}
