"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/modules/shared/ui/button";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/modules/shared/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/dialog";
import { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { toBRFormat } from "@/modules/shared/utils/date-formatter";
import type { RoomListItem } from "@/modules/dashboard/services/get-rooms";
import { useDetailRoom } from "@/modules/dashboard/hooks/use-detail-room";
import { deleteRoom } from "@/modules/dashboard/services/delete-room";

export type DetailsRoomHandle = {
  open: (publicId: string) => void;
  close: () => void;
};

const getVotingScaleLabel = (
  value: RoomListItem["voting_scale"] | null | undefined,
) => {
  if (value === VotingScale.FIBONACCI) return "Fibonacci";
  if (value === VotingScale.POWER_OF_2) return "Power of 2";
  return "Sem escala";
};

export const DetailsRoom = forwardRef<DetailsRoomHandle>(function DetailsRoom(
  _props,
  ref,
) {
  const [open, setOpen] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const roomsQueries = queryClient.getQueriesData<RoomListItem[]>({
    queryKey: ["rooms:list"],
  });
  const rooms = useMemo(
    () => roomsQueries.flatMap(([, data]) => data ?? []),
    [roomsQueries],
  );
  const previewRoom = useMemo(
    () => rooms.find((item) => item.public_id === publicId),
    [rooms, publicId],
  );
  const { data: detailRoom, isLoading } = useDetailRoom(publicId, open);

  const roomName = detailRoom?.name ?? previewRoom?.name ?? "Sala";
  const createdAt = detailRoom?.created_at ?? previewRoom?.created_at;
  const status = detailRoom?.status ?? previewRoom?.status ?? "open";
  const isPublic = detailRoom?.is_public ?? previewRoom?.is_public ?? true;
  const votingScale = detailRoom?.voting_scale ?? previewRoom?.voting_scale;
  const description = detailRoom?.description ?? previewRoom?.description;
  const participantsCount = previewRoom?.participants_count ?? 0;

  const handleDelete = async () => {
    if (!publicId) return;
    const deletingId = publicId;
    const roomQueries = queryClient.getQueriesData<RoomListItem[]>({
      queryKey: ["rooms:list"],
    });
    const previousRooms = roomQueries.map(([key, data]) => [key, data] as const);
    setIsDeleting(true);
    setDeleteError(null);
    roomQueries.forEach(([key]) => {
      queryClient.setQueryData<RoomListItem[]>(key, (current) =>
        current?.filter((room) => room.public_id !== deletingId),
      );
    });
    setOpen(false);
    setPublicId(null);

    try {
      await deleteRoom(deletingId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rooms:list"] }),
        queryClient.invalidateQueries({ queryKey: ["rooms:detail", deletingId] }),
      ]);
    } catch {
      previousRooms.forEach(([key, data]) => {
        queryClient.setQueryData<RoomListItem[]>(key, data);
      });
      setDeleteError("Nao foi possivel excluir a sala. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (nextPublicId: string) => {
        setPublicId(nextPublicId);
        setOpen(true);
        setDeleteError(null);
      },
      close: () => {
        setOpen(false);
        setPublicId(null);
      },
    }),
    [],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setPublicId(null);
          setDeleteError(null);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isLoading ? <Skeleton className="h-6 w-48" /> : roomName}
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Carregando informacoes da sala..."
              : "Informacoes da sala."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-md" />
          ) : (
            <div className="h-48 w-full overflow-hidden rounded-md border border-border">
              <img
                src="/banners/auth.gif"
                alt={`Imagem da sala ${roomName}`}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`detail-room-skeleton-${index}`}
                    className="space-y-2"
                  >
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Criacao
                  </p>
                  <p className="text-sm font-medium">
                    {createdAt ? toBRFormat(createdAt) : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-medium">{status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Visibilidade
                  </p>
                  <p className="text-sm font-medium">
                    {isPublic ? "Publica" : "Privada"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Escala
                  </p>
                  <p className="text-sm font-medium">
                    {getVotingScaleLabel(votingScale)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Participantes
                  </p>
                  <p className="text-sm font-medium">{participantsCount}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground">
                  Descricao
                </p>
                <p className="text-sm text-foreground">
                  {description ? description : "Sem descricao."}
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading || !publicId}
              >
                Excluir sala
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir sala?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa acao remove a sala permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError ? (
                <p className="text-sm text-destructive">{deleteError}</p>
              ) : null}
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir sala"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button type="button">Entrar na sala</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
