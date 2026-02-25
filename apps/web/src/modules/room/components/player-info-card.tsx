"use client";

import { useMemo } from "react";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { useInfoUser } from "../hooks/use-info-user";
import { useRoomUiStore } from "../stores/room-ui-store";

function formatTimeOnPlatform(days?: number) {
  const safeDays = Math.max(0, Number(days ?? 0));
  if (safeDays < 1) return "Entrou hoje";
  if (safeDays < 30) return `${safeDays} dia${safeDays > 1 ? "s" : ""} na plataforma`;
  if (safeDays < 365) {
    const months = Math.floor(safeDays / 30);
    return `${months} mes${months > 1 ? "es" : ""} na plataforma`;
  }
  const years = Math.floor(safeDays / 365);
  return `${years} ano${years > 1 ? "s" : ""} na plataforma`;
}

function getInitials(name?: string) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function PlayerInfoCard() {
  const publicId = useRoomUiStore((s) => s.selectedPlayerPublicId);
  const { data, isLoading, isError } = useInfoUser(publicId);

  const platformTimeLabel = useMemo(
    () => formatTimeOnPlatform(data?.platform_time_days),
    [data?.platform_time_days],
  );

  if (!publicId) return null;

  return (
    <div className="absolute top-4 right-4 z-50 w-[320px] overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/95 shadow-2xl">
      <div className="h-16 bg-gradient-to-r from-cyan-500/25 via-emerald-500/20 to-sky-500/25" />
      <div className="px-4 pb-4 -mt-8">
        <div className="h-16 w-16 rounded-xl border-2 border-slate-900 bg-slate-800 shadow-lg overflow-hidden flex items-center justify-center">
          {data?.avatar_url ? (
            <img src={data.avatar_url} alt={data.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-base font-bold text-slate-100">{getInitials(data?.name)}</span>
          )}
        </div>

        {isLoading ? (
          <section className="mt-3 space-y-2" aria-busy="true" aria-live="polite">
            <Skeleton className="h-4 w-32 bg-slate-700/70" />
            <Skeleton className="h-3 w-20 bg-slate-700/60" />
            <Skeleton className="h-16 w-full bg-slate-700/50" />
          </section>
        ) : isError || !data ? (
          <div className="mt-3">
            <p className="text-sm text-rose-300">Nao foi possivel carregar o perfil.</p>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-slate-100 truncate">{data.name}</p>
              <span className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                Lv {data.level}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              {data.description?.trim() || "Sem descricao ainda."}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
                <span className="text-[10px] uppercase tracking-wide text-slate-400">XP</span>
                <p className="text-sm font-semibold text-slate-100">{data.xp}</p>
              </div>
              <div className="rounded-md border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
                <span className="text-[10px] uppercase tracking-wide text-slate-400">Tempo</span>
                <p className="text-xs font-medium text-slate-200">{platformTimeLabel}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
