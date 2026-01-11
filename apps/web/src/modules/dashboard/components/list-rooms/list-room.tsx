"use client";

import React, { useRef, useState } from "react";
import { Star, Users } from "lucide-react";
import { DataTableEmptyState } from "@/modules/shared/components/data-table";
import { Card } from "@/modules/shared/ui/card";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { toBRFormat } from "@/modules/shared/utils/date-formatter";
import { useGetRooms } from "../../hooks/use-rooms";
import { FilterRoom } from "./filters-room";
import { DetailsRoom, type DetailsRoomHandle } from "../details-room/details-room";
import type { RoomSort } from "../../services/get-rooms";

export function RoomList() {
  const [sortBy, setSortBy] = useState<RoomSort>("recent");
  const { data, isLoading } = useGetRooms({ sort: sortBy });
  const rooms = data ?? [];
  const detailsRoomRef = useRef<DetailsRoomHandle>(null);

  if (isLoading) {
    return (
      <div className="h-full">
        <FilterRoom
          roomLength={rooms.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <LoadingCardSkeleton />
      </div>
    );
  }

  return (
    <div className="h-full">
      <FilterRoom
        roomLength={rooms.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {rooms.length === 0 ? (
        <DataTableEmptyState
          title="Nenhuma sala encontrada"
          description="Crie uma sala para comecar uma nova votacao."
          icon={Users}
          disabledBackground
        />
      ) : (
        <div className="flex w-full h-[calc(100%-30px)] pb-10 pr-2 overflow-y-auto flex-wrap items-start justify-start gap-6">
          {rooms.map((room) => (
            <Card
              key={room.public_id}
              className="h-[250px] w-full max-w-[600px] basis-[calc(33.333%-16px)] overflow-hidden border-muted bg-card/80 cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => detailsRoomRef.current?.open(room.public_id)}
            >
              <div className="h-[150px] w-full">
                <img src="/banners/auth.gif" alt={room.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex h-[100px] flex-col justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{room.name}</h3>
                    <div className="flex items-center gap-1 text-xs">
                      <Star
                        className={
                          room.is_favorite
                            ? "h-4 w-4 fill-amber-500 text-amber-500"
                            : "h-4 w-4 fill-transparent text-muted-foreground"
                        }
                      />
                      <span className="text-muted-foreground">
                        {room.is_favorite ? "Favorito" : "Nao favorito"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Criacao: {toBRFormat(room.created_at)}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Jogadores: <span className="font-medium text-foreground">{room.participants_count}</span>
                </div>
              </div>
            </Card>
          ))}
          <DetailsRoom ref={detailsRoomRef} />
        </div>
      )}
    </div>
  );
}

const LoadingCardSkeleton = () => (
  <div className="h-[calc(100%-30px)] overflow-y-auto">
    <div className="flex w-full  flex-wrap items-start justify-start gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={`room-skeleton-${index}`}
          className="h-[250px] w-full max-w-[600px] min-w-[300px] basis-[calc(33.333%-16px)] overflow-hidden border-muted"
        >
          <Skeleton className="h-[150px] w-full rounded-none dark:opacity-30" />
          <div className="flex h-[100px] flex-col justify-between p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3 dark:opacity-30" />
              <Skeleton className="h-3 w-1/2 dark:opacity-30" />
            </div>
            <Skeleton className="h-3 w-1/3 dark:opacity-30" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);
