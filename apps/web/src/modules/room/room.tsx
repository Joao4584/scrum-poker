"use client";

import dynamic from "next/dynamic";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { UpdateNameCard } from "./components/update-name-card";

const DynamicPhaserGame = dynamic(() => import("./PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

export default function TestPage() {
  const [skinParam] = useQueryState("skin");
  const [idParam] = useQueryState("id");
  const { setGameFocus } = useRoomActions();

  const skin = (skinParam ?? "steve").toString().toLowerCase();
  const userId = idParam ? idParam.toString().slice(0, 32) : null;

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        <DynamicPhaserGame skin={skin} userId={userId} />
      </div>
      <UpdateNameCard />
      <FocusReturnButton />
      <PingCard />
      <NearbyPlayers />
      <ChatCard />
    </div>
  );
}
