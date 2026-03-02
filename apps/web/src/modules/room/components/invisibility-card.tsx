"use client";

import { useI18n } from "@/locales/client";
import { useRoomUiStore } from "../stores/room-ui-store";

export function InvisibilityCard() {
  const t = useI18n();
  const invisibleMode = useRoomUiStore((s) => s.invisibleMode);
  const toggleInvisibleMode = useRoomUiStore((s) => s.toggleInvisibleMode);

  return (
    <div className="absolute bottom-4 left-32 z-50 rounded-lg border border-sky-200/80 bg-white/85 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={toggleInvisibleMode}
        className="flex items-center gap-2 text-left"
        aria-pressed={invisibleMode}
        title={invisibleMode ? t("room.invisibility.titleDisable") : t("room.invisibility.titleEnable")}
      >
        <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("room.invisibility.label")}</span>
        <span
          className={[
            "rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors",
            invisibleMode
              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/50 dark:text-emerald-300"
              : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600/70 dark:bg-slate-800/70 dark:text-slate-200",
          ].join(" ")}
        >
          {invisibleMode ? t("room.invisibility.active") : t("room.invisibility.off")}
        </span>
      </button>
    </div>
  );
}
