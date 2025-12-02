"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRoomStore } from "./game/room-store";
import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";

const DynamicPhaserGame = dynamic(
  () => import("./game/PhaserGame").then((mod) => mod.PhaserGame),
  { ssr: false },
);

export default function TestPage() {
  const room = useRoomStore((s) => s.room);
  const focusGame = useRoomStore((s) => s.focusGame);
  const keyboardToggle = useRoomStore((s) => s.keyboardToggle);
  const [isGameFocused, setIsGameFocused] = useState(true);
  const [skinParam] = useQueryState("skin");
  const [idParam] = useQueryState("id");
  const [botParam] = useQueryState("bot");
  const [name, setName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [lastChatAt, setLastChatAt] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const skin = (skinParam ?? "steve").toString().toLowerCase();
  const userId = idParam ? idParam.toString().slice(0, 32) : null;
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
    const trimmed = chatMessage.trim();
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
    return () => document.removeEventListener("mousedown", handler);
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
      <div
        ref={overlayRef}
        data-focus-target
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3 py-2 rounded-lg shadow-lg"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          onFocus={() => setGameFocus(false)}
          onBlur={() => setGameFocus(true)}
          onKeyDownCapture={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          className="px-3 py-2 bg-slate-800 text-slate-100 text-sm rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
        <button
          onClick={updateName}
          className="px-3 py-2 text-sm font-semibold bg-emerald-500 text-slate-900 rounded hover:bg-emerald-400 transition disabled:opacity-50"
          disabled={!room}
        >
          Atualizar
        </button>
      </div>
      {!isGameFocused && (
        <button
          onClick={() => {
            setGameFocus(true);
          }}
          className="absolute top-4 right-4 z-50 px-3 py-2 text-xs font-semibold bg-slate-800/90 text-slate-100 border border-slate-700 rounded shadow hover:bg-slate-700 transition"
        >
          Voltar ao jogo
        </button>
      )}
      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-md shadow-xl">
        <input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Mensagem"
          onFocus={() => setGameFocus(false)}
          onBlur={() => setGameFocus(true)}
          onKeyDownCapture={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendChat();
            }
          }}
          className="px-3 py-2 bg-slate-800 text-slate-100 text-sm rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
        <button
          onClick={sendChat}
          className="px-3 py-2 text-sm font-semibold bg-emerald-500 text-slate-900 rounded hover:bg-emerald-400 transition disabled:opacity-50"
          disabled={!room}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
