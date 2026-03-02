"use client";

import { useState } from "react";
import { RotateCw, Star } from "lucide-react";
import { useI18n } from "@/locales/client";
import { Button } from "@/modules/shared/ui/button";
import { Label } from "@/modules/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/ui/select";
import { cn } from "@/modules/shared/utils";
import type { RoomSort } from "@/modules/rooms/services/get-rooms";

type FilterRoomProps = {
  roomLength: number;
  sortBy: RoomSort;
  onSortChange: (value: RoomSort) => void;
  onReload: () => void;
};

type RoomStatus = "all" | "mine" | "joined";

export function FilterRoom(props: FilterRoomProps) {
  const t = useI18n();
  const [status, setStatus] = useState<RoomStatus>("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  return (
    <div className="mb-3 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-semibold">{t("dashboard.roomFilters.title")}</h2>
        <span className="text-sm text-muted-foreground ">{t("dashboard.roomFilters.roomCount", { count: props.roomLength })}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">{t("dashboard.roomFilters.sort")}</Label>
          <Select
            value={props.sortBy}
            onValueChange={(value) => props.onSortChange(value as RoomSort)}
          >
            <SelectTrigger className="h-8 w-[170px] bg-secondary">
              <SelectValue placeholder={t("dashboard.roomFilters.sortPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{t("dashboard.roomFilters.sortRecent")}</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="players">{t("dashboard.roomFilters.sortPlayers")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">{t("dashboard.roomFilters.status")}</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as RoomStatus)}>
            <SelectTrigger className="h-8 w-[210px] bg-secondary">
              <SelectValue placeholder={t("dashboard.roomFilters.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.roomFilters.statusAll")}</SelectItem>
              <SelectItem value="mine">{t("dashboard.roomFilters.statusMine")}</SelectItem>
              <SelectItem value="joined">{t("dashboard.roomFilters.statusJoined")}</SelectItem>
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
          {t("dashboard.roomFilters.favorites")}
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-8 gap-2" onClick={props.onReload}>
          <RotateCw className="h-4 w-4" />
          {t("dashboard.roomFilters.reload")}
        </Button>
      </div>
    </div>
  );
}
