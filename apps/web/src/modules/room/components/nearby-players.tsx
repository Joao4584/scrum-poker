"use client";

import { useNearbyStore } from "../stores/nearby-store";

export function NearbyPlayers() {
  const nearbyPlayers = useNearbyStore((s) => s.nearbyPlayers);

  if (nearbyPlayers.length === 0) return null;
  return (
    <div className="absolute bottom-4 left-4 z-50 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-md shadow-xl min-w-[180px]">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">Perto de voce</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {nearbyPlayers.map((name, index) => (
          <span key={`${name}-${index}`} className="px-2 py-1 text-xs font-semibold bg-slate-800 text-slate-100 rounded border border-slate-700">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
