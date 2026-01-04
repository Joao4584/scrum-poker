"use client";

import React from "react";
import { useRoomStore } from "../game/room-store";

type UpdateNameCardProps = {
  name: string;
  overlayRef: React.RefObject<HTMLDivElement>;
  setName: (value: string) => void;
  updateName: () => void;
  setGameFocus: (enabled: boolean) => void;
};

export function UpdateNameCard({
  name,
  overlayRef,
  setName,
  updateName,
  setGameFocus,
}: UpdateNameCardProps) {
  const room = useRoomStore((s) => s.room);

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
