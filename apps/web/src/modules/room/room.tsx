"use client";

import dynamic from "next/dynamic";
import { useRoomActions } from "./hooks/use-room-actions";
import { useQueryState } from "nuqs";
import { ChatCard } from "./components/chat-card";
import { FocusReturnButton } from "./components/focus-return-button";
import { NearbyPlayers } from "./components/nearby-players";
import { PingCard } from "./components/ping-card";
import { useUser } from "@/modules/dashboard/hooks/use-user";
import type { RoomDetail } from "../dashboard/services/get-room-detail";
import spriteAssets from "./sprites-assets.json";
import { useState } from "react";

const DynamicPhaserGame = dynamic(() => import("./PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

interface RoomPageProps {
  room: RoomDetail;
}

export default function RoomPage(props: RoomPageProps) {
  const [idParam] = useQueryState("id");
  const { setGameFocus } = useRoomActions();

  const { data: user } = useUser();
  const userId = user?.public_id ?? (idParam ? idParam.toString().slice(0, 32) : null);
  const displayName = formatDisplayName(user?.name);
  const skinOptions = Object.keys(spriteAssets);
  const defaultSkin = skinOptions[0] ?? "steve";
  const [pendingSkin, setPendingSkin] = useState<string>(defaultSkin);
  const [skin, setSkin] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        {skin && (
          <DynamicPhaserGame
            skin={skin}
            userId={userId}
            displayName={displayName}
            roomPublicId={props.room.public_id}
          />
        )}
      </div>
      {!skin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/70">
          <div className="w-[92%] max-w-md rounded-2xl border border-slate-200/10 bg-slate-900 px-6 py-5 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-100">Escolha sua skin</h2>
            <p className="mt-1 text-sm text-slate-300">
              Selecione um personagem para entrar na sala.
            </p>
            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Skins
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
              value={pendingSkin}
              onChange={(event) => setPendingSkin(event.target.value)}
            >
              {skinOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              className="mt-5 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              type="button"
              onClick={() => setSkin(pendingSkin.toLowerCase())}
            >
              Pronto
            </button>
          </div>
        </div>
      )}
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
