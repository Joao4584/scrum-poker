import { Skeleton } from "@/modules/shared/ui/skeleton";

export function PokerPanelSkeleton() {
  return (
    <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`planning-skeleton-${index}`}
          className="rounded-2xl border border-slate-800 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] p-3.5 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full bg-slate-700/60" />
                <Skeleton className="h-5 w-20 rounded-full bg-slate-700/60" />
              </div>
              <Skeleton className="h-4 w-11/12 bg-slate-700/60" />
              <Skeleton className="h-4 w-8/12 bg-slate-700/60" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-7 rounded-full bg-slate-700/60" />
                <Skeleton className="h-7 w-7 rounded-full bg-slate-700/60" />
                <Skeleton className="h-7 w-7 rounded-full bg-slate-700/60" />
              </div>
            </div>
            <Skeleton className="h-10 w-12 rounded-2xl bg-slate-700/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
