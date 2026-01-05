"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/modules/shared/ui/button";
import { Label } from "@/modules/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/ui/select";
import { cn } from "@/modules/shared/utils";

type FilterRoomProps = {
  roomLength: number;
};

type RoomSort = "recent" | "alphabetical" | "players";
type RoomStatus = "all" | "mine" | "joined";

export function FilterRoom(props: FilterRoomProps) {
  const [sortBy, setSortBy] = useState<RoomSort>("recent");
  const [status, setStatus] = useState<RoomStatus>("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  return (
    <div className="mb-3 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-semibold">Salas</h2>
        <span className="text-sm text-muted-foreground ">{props.roomLength} salas</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Ordenar</Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as RoomSort)}>
            <SelectTrigger className="h-8 w-[170px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="players">Mais jogadores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as RoomStatus)}>
            <SelectTrigger className="h-8 w-[210px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as salas</SelectItem>
              <SelectItem value="mine">Minhas salas</SelectItem>
              <SelectItem value="joined">Salas que eu ja entrei</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-8 gap-2", favoriteOnly && "border-transparent bg-secondary text-secondary-foreground")}
          aria-pressed={favoriteOnly}
          onClick={() => setFavoriteOnly((prev) => !prev)}
        >
          <Star className={cn("h-4 w-4", favoriteOnly ? "fill-current" : "fill-transparent")} />
          Favoritos
        </Button>
      </div>
    </div>
  );
}
