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
    <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("planning.panel.votingDeck.title")}</p>
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
                  ? "border-cyan-300 bg-cyan-400/20 text-cyan-100"
                  : "border-slate-800 bg-slate-950/80 text-slate-200 hover:border-slate-700 hover:bg-slate-900",
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
