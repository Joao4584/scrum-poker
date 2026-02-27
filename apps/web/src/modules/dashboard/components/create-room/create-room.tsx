"use client";

import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useI18n } from "@/locales/client";
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
  const t = useI18n();
  const queryClient = useQueryClient();
  const minimized = useSidebarSizeStore((state) => state.minimized);
  const detailsRoomRef = useRef<DetailsRoomHandle>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState("true");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [votingScale, setVotingScale] = useState<"none" | VotingScale>("none");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPublic("true");
    setPassword("");
    setConfirmPassword("");
    setVotingScale("none");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError(t("dashboard.createRoom.errors.nameMin"));
      return;
    }

    const isPrivateRoom = isPublic === "false";
    if (isPrivateRoom) {
      if (password.length < 6) {
        setError(t("dashboard.createRoom.errors.passwordMin"));
        return;
      }

      if (password !== confirmPassword) {
        setError(t("dashboard.createRoom.errors.passwordConfirm"));
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createRoom({
        name: trimmedName,
        description: description.trim() || undefined,
        public: !isPrivateRoom,
        password: isPrivateRoom ? password : undefined,
        voting_scale: votingScale === "none" ? undefined : votingScale,
      });

      await queryClient.invalidateQueries({ queryKey: ["rooms:list"] });

      setOpen(false);
      resetForm();
      if (response.room?.public_id) {
        detailsRoomRef.current?.open(response.room.public_id);
      }
    } catch {
      setError(t("dashboard.createRoom.errors.createFailed"));
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
          {minimized ? null : t("dashboard.createRoom.triggerNew")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("dashboard.createRoom.title")}</DialogTitle>
          <DialogDescription>{t("dashboard.createRoom.description")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="room-name">{t("dashboard.createRoom.fields.name")}</Label>
            <Input
              id="room-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("dashboard.createRoom.placeholders.roomName")}
              required
              minLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-description">{t("dashboard.createRoom.fields.description")}</Label>
            <textarea
              id="room-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder={t("dashboard.createRoom.placeholders.optional")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("dashboard.createRoom.fields.visibility")}</Label>
              <Select
                value={isPublic}
                onValueChange={(value) => {
                  setIsPublic(value);
                  if (value === "true") {
                    setPassword("");
                    setConfirmPassword("");
                  }
                }}
              >
                <SelectTrigger className="h-9 bg-secondary">
                  <SelectValue placeholder={t("dashboard.createRoom.placeholders.select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t("dashboard.createRoom.visibility.public")}</SelectItem>
                  <SelectItem value="false">{t("dashboard.createRoom.visibility.private")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("dashboard.createRoom.fields.votingScale")}</Label>
              <Select value={votingScale} onValueChange={(value) => setVotingScale(value as "none" | VotingScale)}>
                <SelectTrigger className="h-9 bg-secondary">
                  <SelectValue placeholder={t("dashboard.createRoom.placeholders.optional")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("dashboard.createRoom.scale.none")}</SelectItem>
                  <SelectItem value={VotingScale.FIBONACCI}>{t("dashboard.createRoom.scale.fibonacci")}</SelectItem>
                  <SelectItem value={VotingScale.POWER_OF_2}>{t("dashboard.createRoom.scale.powerOf2")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isPublic === "false" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="room-password">{t("dashboard.createRoom.fields.roomPassword")}</Label>
                <Input
                  id="room-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("dashboard.createRoom.placeholders.minPassword")}
                  minLength={6}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-confirm-password">{t("dashboard.createRoom.fields.confirmPassword")}</Label>
                <Input
                  id="room-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={t("dashboard.createRoom.placeholders.repeatPassword")}
                  minLength={6}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("dashboard.createRoom.actions.cancel")}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t("dashboard.createRoom.actions.creating") : t("dashboard.createRoom.actions.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <DetailsRoom ref={detailsRoomRef} />
    </Dialog>
  );
}
