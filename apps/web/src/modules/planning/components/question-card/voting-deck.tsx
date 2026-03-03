import { useI18n } from "@/locales/client";
import { cn } from "@/modules/shared/utils/cn";

type VotingDeckProps = {
  cards: string[];
  selectedValue: string | null;
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function VotingDeck(props: VotingDeckProps) {
  const t = useI18n();

  return (
    <div className="space-y-2 rounded-xl border border-slate-300/80 bg-white/75 p-2.5 dark:border-slate-800/80 dark:bg-slate-950/50">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{t("planning.panel.votingDeck.title")}</p>
        <p className="text-[11px] text-slate-500">{props.selectedValue ?? t("planning.panel.votingDeck.empty")}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {props.cards.map((card) => {
          const isSelected = props.selectedValue === card;

          return (
            <button
              key={card}
              type="button"
              className={cn(
                "flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                isSelected
                  ? "border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:border-cyan-300 dark:bg-cyan-400/20 dark:text-cyan-100"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900",
                props.disabled && "cursor-not-allowed opacity-60",
              )}
              disabled={props.disabled}
              onClick={() => props.onSelect(card)}
            >
              {card}
            </button>
          );
        })}
      </div>
    </div>
  );
}
