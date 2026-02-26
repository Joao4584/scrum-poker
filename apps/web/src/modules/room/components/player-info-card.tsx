"use client";

import { Skeleton } from "@/modules/shared/ui/skeleton";
import { useInfoUser } from "../hooks/use-info-user";
import { useRoomUiStore } from "../stores/room-ui-store";

function formatMemberSince(dateString?: string) {
  if (!dateString) return "---";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "---";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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

  if (!publicId) return null;

  return (
    <aside className="absolute top-4 left-4 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-600/60 bg-slate-900/90 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-sm">
      <div className="relative h-28 overflow-hidden border-b border-slate-700/60 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.26),transparent_52%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.26),transparent_50%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        <div className="absolute -right-12 top-3 h-24 w-24 rotate-12 rounded-2xl border border-white/10 bg-white/5" />
        <div className="absolute right-14 top-7 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
      </div>

      <div className="relative px-4 pb-4">
        <div className="-mt-10 flex items-end justify-between gap-3">
          <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-800 shadow-lg ring-1 ring-cyan-200/15 flex items-center justify-center">
            {data?.avatar_url ? (
              <img src={data.avatar_url} alt={data.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-slate-100">{getInitials(data?.name)}</span>
            )}
          </div>

          {!isLoading && !isError && data ? (
            <div className="relative mb-1 shrink-0">
              <div className="absolute inset-1 rounded-full bg-cyan-300/20 blur-lg" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-100/20 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_45%),linear-gradient(145deg,rgba(14,116,144,0.55),rgba(15,23,42,0.95))] shadow-[0_12px_28px_-14px_rgba(34,211,238,0.8)]">
                <div className="absolute inset-[4px] rounded-full border border-cyan-200/30" />
                <div className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-cyan-300/25 blur-sm" />
                <div className="relative text-center leading-none">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-100/80">Lv</p>
                  <p className="mt-0.5 text-[22px] font-extrabold tracking-tight text-white">
                    {data.level}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <section className="mt-4 space-y-3" aria-busy="true" aria-live="polite">
            <Skeleton className="h-5 w-40 rounded-md bg-slate-700/70" />
            <Skeleton className="h-4 w-24 rounded-md bg-slate-700/60" />
            <Skeleton className="h-14 w-full rounded-xl bg-slate-700/50" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-16 w-full rounded-xl bg-slate-700/50" />
              <Skeleton className="h-16 w-full rounded-xl bg-slate-700/50" />
            </div>
          </section>
        ) : isError || !data ? (
          <div className="mt-4 rounded-xl border border-rose-300/20 bg-rose-400/5 p-3">
            <p className="text-sm text-rose-300">Nao foi possivel carregar o perfil.</p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight text-slate-50">{data.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Informações do Perfil</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-800/45 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Membro desde</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{formatMemberSince(data.member_since)}</p>
            </div>

            <p className="mt-3 rounded-xl border border-slate-700/60 bg-slate-800/35 px-3 py-2.5 text-xs leading-5 text-slate-300">
              {data.description?.trim() || "Sem descricao ainda."}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-700/70 bg-slate-800/55 px-3 py-2">
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">XP Total</span>
                <p className="mt-1 text-base font-semibold text-slate-100">{data.xp}</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-800/55 px-3 py-2">
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Nivel</span>
                <p className="mt-1 text-base font-semibold text-slate-100">{data.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
