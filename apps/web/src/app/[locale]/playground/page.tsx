"use client";

import dynamic from "next/dynamic";
import { useRoomStore } from "./game/room-store";
import { useNearbyStore } from "./game/nearby-store";
import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { sanitizeChatMessage } from "./game/chat-config";
import { ChatCard } from "./layout/chat-card";
import { PingCard } from "./layout/ping-card";
import { UpdateNameCard } from "./layout/update-name-card";
import { useUser } from "@/modules/dashboard/hooks/use-user";

const DynamicPhaserGame = dynamic(() => import("./game/PhaserGame").then((mod) => mod.PhaserGame), {
  ssr: false,
});

type FocusReturnButtonProps = {
  visible: boolean;
  onClick: () => void;
};

function FocusReturnButton({ visible, onClick }: FocusReturnButtonProps) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-50 px-3 py-2 text-xs font-semibold bg-slate-800/90 text-slate-100 border border-slate-700 rounded shadow hover:bg-slate-700 transition"
    >
      Voltar ao jogo
    </button>
  );
}

type NearbyPlayersProps = {
  players: string[];
};

function NearbyPlayers({ players }: NearbyPlayersProps) {
  if (players.length === 0) return null;
  return (
    <div className="absolute bottom-4 left-4 z-50 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-md shadow-xl min-w-[180px]">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">Perto de voce</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {players.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="px-2 py-1 text-xs font-semibold bg-slate-800 text-slate-100 rounded border border-slate-700"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TestPage() {
  const room = useRoomStore((s) => s.room);
  const focusGame = useRoomStore((s) => s.focusGame);
  const keyboardToggle = useRoomStore((s) => s.keyboardToggle);
  const nearbyPlayers = useNearbyStore((s) => s.nearbyPlayers);
  const { data: user } = useUser();
  const [isGameFocused, setIsGameFocused] = useState(true);
  const [skinParam] = useQueryState("skin");
  const [idParam] = useQueryState("id");
  const [botParam] = useQueryState("bot");
  const [name, setName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [lastChatAt, setLastChatAt] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const skin = (skinParam ?? "steve").toString().toLowerCase();
  const userId = user?.public_id ?? (idParam ? idParam.toString().slice(0, 32) : null);
  const botCount = (() => {
    const num = botParam ? Number(botParam) : 0;
    if (!Number.isFinite(num) || num <= 0) return 0;
    return Math.min(3, Math.floor(num));
  })();

  const setGameFocus = (enabled: boolean) => {
    if (enabled) {
      const active = document.activeElement as HTMLElement | null;
      active?.blur();
      keyboardToggle?.(true);
      focusGame?.();
      setIsGameFocused(true);
    } else {
      keyboardToggle?.(false);
      setIsGameFocused(false);
    }
  };

  const updateName = () => {
    const trimmed = name.trim();
    if (!trimmed || !room) return;
    room.send("rename", { name: trimmed });
  };

  const sendChat = () => {
    const trimmed = sanitizeChatMessage(chatMessage);
    if (!trimmed || !room) return;
    const now = Date.now();
    if (now - lastChatAt < 600) return;
    room.send("chat", { text: trimmed });
    setChatMessage("");
    setLastChatAt(now);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!overlayRef.current) return;
      if (overlayRef.current.contains(e.target as Node)) return;
      setGameFocus(true);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [focusGame, keyboardToggle]);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
      <div
        className="w-full h-full"
        onClick={() => {
          setGameFocus(true);
        }}
      >
        <DynamicPhaserGame skin={skin} userId={userId} botCount={botCount} />
      </div>
      <UpdateNameCard
        name={name}
        overlayRef={overlayRef}
        setName={setName}
        updateName={updateName}
        setGameFocus={setGameFocus}
      />
      <FocusReturnButton
        visible={!isGameFocused}
        onClick={() => {
          setGameFocus(true);
        }}
      />
      <PingCard />
      <NearbyPlayers players={nearbyPlayers} />
      <ChatCard
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        sendChat={sendChat}
        setGameFocus={setGameFocus}
      />
    </div>
  );
}
