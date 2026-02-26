"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { PlayerInfoCard } from "./components/player-info-card";
import { InvisibilityCard } from "./components/invisibility-card";
import { useUser } from "@/modules/dashboard/hooks/use-user";
import type { RoomDetail } from "../dashboard/services/get-room-detail";
import { useCharacterStore } from "@/modules/room/stores/character.store";
import { useRoomUiStore } from "./stores/room-ui-store";
import { useRoomStore } from "./stores/room-store";
import { useRoomUploadImages } from "./hooks/use-room-upload-images";
import { useSounds } from "@/modules/shared/hooks/use-sounds";
import { useExperience } from "@/modules/shared/hooks/use-experience";
import { formatDisplayName } from "@/modules/shared/utils";

const DynamicPhaserGame = dynamic(() => import("./PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

interface RoomPageProps {
  room: RoomDetail;
}

let refetchRoomUploadsHandler: null | (() => Promise<void>) = null;

export async function refetchRoomUploads() {
  if (!refetchRoomUploadsHandler) {
    console.warn("[room] refetch handler is not available");
    return;
  }
  await refetchRoomUploadsHandler();
}

export default function RoomPage(props: RoomPageProps) {
  const [idParam] = useQueryState("id");
  const { setGameFocus } = useRoomActions();

  const { data: user } = useUser();
  const userId = user?.public_id ?? (idParam ? idParam.toString().slice(0, 32) : null);
  const displayName = formatDisplayName(user?.name);
  const { level } = useExperience(user?.xp ?? 0);
  const { characterKey } = useCharacterStore();
  const invisibleMode = useRoomUiStore((s) => s.invisibleMode);
  const skin = characterKey || "steve";
  const room = useRoomStore((s) => s.room);
  const { refetchRoomUploads: refetchRoomUploadsFromHook } = useRoomUploadImages(props.room.public_id);
  const sounds = useSounds();

  const handleRoomConnected = useCallback(() => {
    void sounds.play("join-room").then((played) => {
      if (!played) {
        sounds.armUnlockOnFirstInteraction();
      }
    });
  }, [sounds]);

  // Prepara fallback para tocar o som na primeira interacao do usuario.
  useEffect(() => {
    sounds.armUnlockOnFirstInteraction();
  }, [sounds]);

  // Sincroniza invisibilidade com a room em runtime (sem alterar profile/header).
  useEffect(() => {
    if (!room) return;
    room.send("set_ghost", {
      ghost: invisibleMode,
      skin,
    });
  }, [room, invisibleMode, skin]);

  useEffect(() => {
    if (!room) return;
    room.send("set_level", { level });
  }, [room, level]);

  useEffect(() => {
    const previousTitle = document.title;
    const roomName = props.room.name?.trim() || "Room";
    document.title = `${roomName} | Scrum Poker`;

    return () => {
      document.title = previousTitle;
    };
  }, [props.room.name]);

  // Registra refetch automatico/manual para uploads associados a sala.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refetchRoomUploadsFromHook("after_10s");
    }, 10000);

    refetchRoomUploadsHandler = async () => {
      await refetchRoomUploadsFromHook("manual");
    };

    return () => {
      window.clearTimeout(timeoutId);
      refetchRoomUploadsHandler = null;
    };
  }, [refetchRoomUploadsFromHook]);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div className="pointer-events-none absolute left-4 top-4 z-50 max-w-[55vw] truncate text-sm font-semibold text-slate-700 dark:text-white">
        <span className="text-slate-500 dark:text-slate-300">Sala:</span> {props.room.name}
      </div>
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        <DynamicPhaserGame
          skin={skin}
          level={level}
          ghost={invisibleMode}
          userId={userId}
          displayName={displayName}
          roomPublicId={props.room.public_id}
          onRoomConnected={handleRoomConnected}
        />
      </div>
      <FocusReturnButton />
      <PingCard />
      <PlayerInfoCard />
      <NearbyPlayers />
      <InvisibilityCard />
      <ChatCard />
    </div>
  );
}
