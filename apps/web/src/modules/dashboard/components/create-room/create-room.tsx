"use client";

import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/modules/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/ui/dialog";
import { Input } from "@/modules/shared/ui/input";
import { Label } from "@/modules/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/ui/select";
import { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { createRoom } from "../../services/create-room";
import { DetailsRoom, type DetailsRoomHandle } from "../details-room/details-room";
import { useSidebarSizeStore } from "../../stores/sidebar-size.store";

export function CreateRoom() {
  const queryClient = useQueryClient();
  const minimized = useSidebarSizeStore((state) => state.minimized);
  const detailsRoomRef = useRef<DetailsRoomHandle>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState("true");
  const [votingScale, setVotingScale] = useState<"none" | VotingScale>("none");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPublic("true");
    setVotingScale("none");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("O nome da sala deve ter pelo menos 3 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createRoom({
        name: trimmedName,
        description: description.trim() || undefined,
        public: isPublic === "true",
        voting_scale: votingScale === "none" ? undefined : votingScale,
      });

      await queryClient.invalidateQueries({ queryKey: ["rooms:list"] });

      setOpen(false);
      resetForm();
      if (response.room?.public_id) {
        detailsRoomRef.current?.open(response.room.public_id);
      }
    } catch {
      setError("Nao foi possivel criar a sala. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-5/6 text-white bg-gradient-to-r from-[#1a2f47] via-[#02276B] to-[#a8601d] bg-[length:200%_200%]
            transition-[background-position] duration-700 ease-in-out hover:bg-[position:100%_50%]"
        >
          <Plus className=" h-4 w-4" />
          {minimized ? null : "Novo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova sala</DialogTitle>
          <DialogDescription>Preencha os dados para criar uma sala.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="room-name">Nome</Label>
            <Input
              id="room-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Planning Poker - Squad A"
              required
              minLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-description">Descricao</Label>
            <textarea
              id="room-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Opcional"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Visibilidade</Label>
              <Select value={isPublic} onValueChange={setIsPublic}>
                <SelectTrigger className="h-9 bg-secondary">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Publica</SelectItem>
                  <SelectItem value="false">Privada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Escala de votacao</Label>
              <Select value={votingScale} onValueChange={(value) => setVotingScale(value as "none" | VotingScale)}>
                <SelectTrigger className="h-9 bg-secondary">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem escala</SelectItem>
                  <SelectItem value={VotingScale.FIBONACCI}>Fibonacci</SelectItem>
                  <SelectItem value={VotingScale.POWER_OF_2}>Power of 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <DetailsRoom ref={detailsRoomRef} />
    </Dialog>
  );
}
