"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { useUser } from "@/modules/dashboard/hooks/use-user";
import type { RoomDetail } from "../dashboard/services/get-room-detail";
import { useCharacterStore } from "@/modules/room/stores/character.store";
import { useRoomUploadImages } from "./hooks/use-room-upload-images";

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
  const { characterKey } = useCharacterStore();
  const skin = characterKey || "steve";
  const { refetchRoomUploads: refetchRoomUploadsFromHook } = useRoomUploadImages(props.room.public_id);

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
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        <DynamicPhaserGame skin={skin} userId={userId} displayName={displayName} roomPublicId={props.room.public_id} />
      </div>
      <FocusReturnButton />
      <PingCard />
      <NearbyPlayers />
      <ChatCard />
    </div>
  );
}

function formatDisplayName(name?: string | null) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  const shortName = parts.slice(0, 2).join(" ");
  const maxLength = 20;
  if (shortName.length <= maxLength) return shortName;
  return `${shortName.slice(0, maxLength - 3).trimEnd()}...`;
}
