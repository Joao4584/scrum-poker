"use client";

import { useEffect, useRef } from "react";
import { useRoomActions } from "../hooks/use-room-actions";
import { useRoomStore } from "../store/room-store";
import { useRoomUiStore } from "../store/room-ui-store";

export function UpdateNameCard() {
  const room = useRoomStore((s) => s.room);
  const name = useRoomUiStore((s) => s.name);
  const setName = useRoomUiStore((s) => s.setName);
  const { setGameFocus, updateName } = useRoomActions();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!overlayRef.current) return;
      if (overlayRef.current.contains(e.target as Node)) return;
      setGameFocus(true);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setGameFocus]);

  return (
    <div
      ref={overlayRef}
      data-focus-target
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3 py-2 rounded-lg shadow-lg"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        onFocus={() => setGameFocus(false)}
        onBlur={() => setGameFocus(true)}
        onKeyDownCapture={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        className="px-3 py-2 bg-slate-800 text-slate-100 text-sm rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      />
      <button
        onClick={updateName}
        className="px-3 py-2 text-sm font-semibold bg-emerald-500 text-slate-900 rounded hover:bg-emerald-400 transition disabled:opacity-50"
        disabled={!room}
      >
        Atualizar
      </button>
    </div>
  );
}
