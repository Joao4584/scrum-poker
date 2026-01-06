"use client";

import React from "react";
import { Button } from "@/modules/shared/ui/button";
import { Card } from "@/modules/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/ui/dialog";
import { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { toBRFormat } from "@/modules/shared/utils/date-formatter";
import type { RoomListItem } from "@/modules/dashboard/services/get-rooms";

type RoomDetailsDialogProps = {
  room: RoomListItem;
};

const getVotingScaleLabel = (value: RoomListItem["voting_scale"]) => {
  if (value === VotingScale.FIBONACCI) return "Fibonacci";
  if (value === VotingScale.POWER_OF_2) return "Power of 2";
  return "Sem escala";
};

export function RoomDetailsDialog({ room }: RoomDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-[250px] w-full max-w-[600px] basis-[calc(33.333%-16px)] overflow-hidden border-muted bg-card/80 cursor-pointer transition-shadow hover:shadow-md">
          <div className="h-[150px] w-full">
            <img
              src="/banners/auth.gif"
              alt={room.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-[100px] flex-col justify-between p-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">{room.name}</h3>
              <p className="text-xs text-muted-foreground">
                Criacao: {toBRFormat(room.created_at)}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Jogadores:{" "}
              <span className="font-medium text-foreground">
                {room.participants_count}
              </span>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>Informacoes da sala.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="h-48 w-full overflow-hidden rounded-md border border-border">
            <img
              src="/banners/auth.gif"
              alt={`Imagem da sala ${room.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Criacao</p>
              <p className="text-sm font-medium">
                {toBRFormat(room.created_at)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Status</p>
              <p className="text-sm font-medium">{room.status}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">
                Visibilidade
              </p>
              <p className="text-sm font-medium">
                {room.is_public ? "Publica" : "Privada"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">Escala</p>
              <p className="text-sm font-medium">
                {getVotingScaleLabel(room.voting_scale)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">
                Participantes
              </p>
              <p className="text-sm font-medium">{room.participants_count}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground">Descricao</p>
            <p className="text-sm text-foreground">
              {room.description ? room.description : "Sem descricao."}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">Entrar na sala</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
