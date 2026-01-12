"use client";

import { useParams } from "next/navigation";
import { useDetailRoom } from "@/modules/dashboard/hooks/use-detail-room";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";
import { useEffect } from "react";

export default function Page() {
  const setMinimized = useSidebarSizeStore((state) => state.setMinimized);
  const params = useParams<{ room_id?: string | string[] }>();
  const roomId = Array.isArray(params.room_id) ? params.room_id[0] : params.room_id;

  useEffect(() => {
    setMinimized(true);

    return () => {
      setMinimized(false);
    };
  }, []);

  const { data, isLoading } = useDetailRoom(roomId ?? null);

  if (!roomId) {
    return <div>Room id invalido.</div>;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!data) {
    return <div>Sala nao encontrada.</div>;
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">{data.name}</h1>
      <p className="text-sm text-muted-foreground">ID: {data.public_id}</p>
    </div>
  );
}
