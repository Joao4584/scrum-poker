"use client";

import React from "react";
import { Users } from "lucide-react";
import { DataTableEmptyState } from "@/modules/shared/components/data-table";
import { Card } from "@/modules/shared/ui/card";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { useGetRooms } from "../../hooks/use-rooms";
import { FilterRoom } from "./filters-room";
import { RoomDetailsDialog } from "./room-details-dialog";

export function RoomList() {
  const { data, isLoading } = useGetRooms();
  const rooms = data ?? [];

  if (isLoading) {
    return (
      <div className="h-full">
        <FilterRoom roomLength={rooms.length} />
        <LoadingCardSkeleton />
      </div>
    );
  }

  return (
    <div className="h-full">
      <FilterRoom roomLength={rooms.length} />

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
            <RoomDetailsDialog key={room.public_id} room={room} />
          ))}
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
