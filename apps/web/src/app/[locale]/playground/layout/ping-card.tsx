"use client";

import { useEffect, useState } from "react";
import { useRoomStore } from "../game/room-store";

function usePing(room?: ReturnType<typeof useRoomStore>["room"]) {
  const [pingMs, setPingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!room) {
      setPingMs(null);
      return;
    }

    let cancelled = false;
    const off = room.onMessage("pong", (payload: { sentAt?: number }) => {
      if (cancelled) return;
      const sentAt = payload?.sentAt;
      if (typeof sentAt !== "number") return;
      setPingMs(Math.max(0, Math.round(Date.now() - sentAt)));
    });

    const interval = window.setInterval(() => {
      room.send("ping", { sentAt: Date.now() });
    }, 1000);

    return () => {
      cancelled = true;
      off?.();
      window.clearInterval(interval);
    };
  }, [room]);

  return pingMs;
}

export function PingCard() {
  const room = useRoomStore((s) => s.room);
  const pingMs = usePing(room);

  return (
    <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3 py-2 rounded-lg shadow-lg">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">Ping</span>
      <span className="text-sm font-semibold text-slate-100 tabular-nums">
        {pingMs !== null ? `${pingMs} ms` : "--"}
      </span>
    </div>
  );
}
