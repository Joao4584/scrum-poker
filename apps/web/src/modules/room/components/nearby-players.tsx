"use client";

import { useI18n } from "@/locales/client";
import { useNearbyStore } from "../stores/nearby-store";

export function NearbyPlayers() {
  const t = useI18n();
  const nearbyPlayers = useNearbyStore((s) => s.nearbyPlayers);

  if (nearbyPlayers.length === 0) return null;
  return (
    <div className="absolute bottom-4 left-4 z-50 min-w-[180px] rounded-md border border-sky-200/80 bg-white/88 px-3 py-2 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("room.nearby.label")}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {nearbyPlayers.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="rounded border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
