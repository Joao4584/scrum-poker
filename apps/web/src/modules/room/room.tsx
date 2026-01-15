"use client";

import dynamic from "next/dynamic";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { UpdateNameCard } from "./components/update-name-card";
import { useUser } from "@/modules/dashboard/hooks/use-user";
import type { RoomDetail } from "../dashboard/services/get-room-detail";

const DynamicPhaserGame = dynamic(() => import("./PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

interface RoomPageProps {
  room: RoomDetail;
}

export default function RoomPage(props: RoomPageProps) {
  const [skinParam] = useQueryState("skin");
  const [idParam] = useQueryState("id");
  const { setGameFocus } = useRoomActions();

  const { data: user } = useUser();

  const skin = (skinParam ?? "steve").toString().toLowerCase();
  const userId = user?.public_id ?? (idParam ? idParam.toString().slice(0, 32) : null);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        <DynamicPhaserGame skin={skin} userId={userId} roomPublicId={props.room.public_id} />
      </div>
      <UpdateNameCard />
      <FocusReturnButton />
      <PingCard />
      <NearbyPlayers />
      <ChatCard />
    </div>
  );
}
