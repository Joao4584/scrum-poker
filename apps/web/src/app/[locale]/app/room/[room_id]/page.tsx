"use client";

import { useParams } from "next/navigation";
import { useDetailRoom } from "@/modules/dashboard/hooks/use-detail-room";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RoomPage from "@/modules/room/room";
import { RoomLoading } from "./loading-state";
import { RoomNotFound } from "./room-not-found";

export default function Page() {
  const setMinimized = useSidebarSizeStore((state) => state.setMinimized);
  const params = useParams<{
    room_id?: string | string[];
    locale?: string | string[];
  }>();
  const roomId = Array.isArray(params.room_id) ? params.room_id[0] : params.room_id;
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const homeHref = locale ? `/${locale}/app` : "/app";

  useEffect(() => {
    setMinimized(true);

    return () => {
      setMinimized(false);
    };
  }, []);

  const { data, isLoading } = useDetailRoom(roomId ?? null);

  if (!roomId) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center max-w-lg space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
            <p className="text-sm font-semibold text-amber-400">Link invalido</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Sala invalida</h1>
          </div>

          <p className="animate-fade-in-up text-base leading-7 text-slate-600 dark:text-slate-300" style={{ animationDelay: "0.12s" }}>
            O link da sala esta incompleto ou nao existe. Verifique o convite e tente novamente.
          </p>

          <div className="animate-fade-in-up flex items-center justify-center gap-4 flex-wrap" style={{ animationDelay: "0.2s" }}>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para salas
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <RoomLoading />;
  }

  if (!data) {
    return <RoomNotFound homeHref={homeHref} />;
  }

  return <RoomPage room={data} />;
}
