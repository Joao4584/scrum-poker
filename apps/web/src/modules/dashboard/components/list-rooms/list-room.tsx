"use client";

import React from "react";
import { Users } from "lucide-react";
import { DataTableEmptyState } from "@/modules/shared/components/data-table";
import { Card } from "@/modules/shared/ui/card";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { toBRFormat } from "@/modules/shared/utils/date-formatter";
import { useGetRooms } from "../../hooks/use-rooms";

export function RoomList() {
  const { data, isLoading } = useGetRooms();
  const rooms = data?.data ?? [];

  if (isLoading) {
    return <LoadingCardSkeleton />;
  }

  return (
    <div className="h-full">
      <div className="mb-3 flex w-full justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-base font-semibold">Salas</h2>
          <span className="text-sm text-muted-foreground">{rooms.length} salas</span>
        </div>
      </div>

      {rooms.length === 0 ? (
        <DataTableEmptyState
          title="Nenhuma sala encontrada"
          description="Crie uma sala para comecar uma nova votacao."
          icon={Users}
        />
      ) : (
        <div className="flex w-full h-[calc(100%-20px)] pb-10 pr-2 overflow-y-auto flex-wrap items-start justify-start gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="h-[250px] w-full max-w-[600px] basis-[calc(33.333%-16px)] overflow-hidden border-muted"
            >
              <div className="h-[150px] w-full">
                <img src={room.imageUrl} alt={room.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex h-[100px] flex-col justify-between p-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">{room.title}</h3>
                  <p className="text-xs text-muted-foreground">Criacao: {toBRFormat(room.createdAt)}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Jogadores:{" "}
                  <span className="font-medium text-foreground">
                    {room.playersCurrent}/{room.playersMax}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const LoadingCardSkeleton = () => (
  <div className="h-full overflow-y-auto">
    <div className="flex w-full flex-wrap items-start justify-start gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={`room-skeleton-${index}`}
          className="h-[250px] w-full max-w-[600px] min-w-[300px] basis-[calc(33.333%-16px)] overflow-hidden border-muted"
        >
          <Skeleton className="h-[150px] w-full rounded-none" />
          <div className="flex h-[100px] flex-col justify-between p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-3 w-1/3" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);
