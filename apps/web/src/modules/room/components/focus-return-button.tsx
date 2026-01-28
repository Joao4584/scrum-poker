"use client";

import { useRoomActions } from "../hooks/use-room-actions";
import { useRoomUiStore } from "../stores/room-ui-store";

export function FocusReturnButton() {
  const isGameFocused = useRoomUiStore((s) => s.isGameFocused);
  const { setGameFocus } = useRoomActions();

  if (isGameFocused) return null;
  return (
    <button
      onClick={() => {
        setGameFocus(true);
      }}
      className="absolute top-4 right-4 z-50 px-3 py-2 text-xs font-semibold bg-slate-800/90 text-slate-100 border border-slate-700 rounded shadow hover:bg-slate-700 transition"
    >
      Voltar ao jogo
    </button>
  );
}
