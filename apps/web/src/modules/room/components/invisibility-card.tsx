"use client";

import { useRoomUiStore } from "../stores/room-ui-store";

export function InvisibilityCard() {
  const invisibleMode = useRoomUiStore((s) => s.invisibleMode);
  const toggleInvisibleMode = useRoomUiStore((s) => s.toggleInvisibleMode);

  return (
    <div className="absolute bottom-4 left-32 z-50 rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 py-2 shadow-lg">
      <button
        type="button"
        onClick={toggleInvisibleMode}
        className="flex items-center gap-2 text-left"
        aria-pressed={invisibleMode}
        title={invisibleMode ? "Desativar invisibilidade" : "Ativar invisibilidade"}
      >
        <span className="text-[11px] uppercase tracking-wide text-slate-400">Invisivel</span>
        <span
          className={[
            "rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors",
            invisibleMode ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300" : "border-slate-600/70 bg-slate-800/70 text-slate-200",
          ].join(" ")}
        >
          {invisibleMode ? "Ativo" : "Off"}
        </span>
      </button>
    </div>
  );
}
