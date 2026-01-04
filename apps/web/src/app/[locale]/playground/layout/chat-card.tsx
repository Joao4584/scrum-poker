"use client";

import { CHAT_MESSAGE_MAX_CHARS } from "../game/chat-config";
import { useRoomStore } from "../game/room-store";

type ChatCardProps = {
  chatMessage: string;
  setChatMessage: (value: string) => void;
  sendChat: () => void;
  setGameFocus: (enabled: boolean) => void;
};

export function ChatCard({
  chatMessage,
  setChatMessage,
  sendChat,
  setGameFocus,
}: ChatCardProps) {
  const room = useRoomStore((s) => s.room);

  return (
    <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-md shadow-xl">
      <input
        value={chatMessage}
        onChange={(e) => {
          const next = e.target.value.slice(0, CHAT_MESSAGE_MAX_CHARS);
          setChatMessage(next);
        }}
        maxLength={CHAT_MESSAGE_MAX_CHARS}
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
  );
}
