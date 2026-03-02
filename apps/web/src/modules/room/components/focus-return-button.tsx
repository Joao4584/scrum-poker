"use client";

import { useI18n } from "@/locales/client";
import { useRoomActions } from "../hooks/use-room-actions";
import { useRoomUiStore } from "../stores/room-ui-store";

export function FocusReturnButton() {
  const t = useI18n();
  const isGameFocused = useRoomUiStore((s) => s.isGameFocused);
  const { setGameFocus } = useRoomActions();

  if (isGameFocused) return null;
  return (
    <button
      onClick={() => {
        setGameFocus(true);
      }}
      className="absolute top-4 right-4 z-50 rounded border border-sky-300 bg-white/92 px-3 py-2 text-xs font-semibold text-slate-800 shadow backdrop-blur-sm transition hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {t("room.focusReturn.button")}
    </button>
  );
}
