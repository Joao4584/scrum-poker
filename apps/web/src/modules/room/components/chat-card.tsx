"use client";

import { useI18n } from "@/locales/client";
import { CHAT_MESSAGE_MAX_CHARS } from "@/modules/shared/config/phaser-js/chat-config";
import { useRoomActions } from "../hooks/use-room-actions";
import { useRoomStore } from "../stores/room-store";
import { useRoomUiStore } from "../stores/room-ui-store";

export function ChatCard() {
  const t = useI18n();
  const room = useRoomStore((s) => s.room);
  const chatMessage = useRoomUiStore((s) => s.chatMessage);
  const setChatMessage = useRoomUiStore((s) => s.setChatMessage);
  const { sendChat, setGameFocus } = useRoomActions();

  return (
    <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border border-sky-200/80 bg-white/88 px-3 py-2 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <input
        value={chatMessage}
        onChange={(e) => {
          const next = e.target.value.slice(0, CHAT_MESSAGE_MAX_CHARS);
          setChatMessage(next);
        }}
        maxLength={CHAT_MESSAGE_MAX_CHARS}
        placeholder={t("room.chat.placeholder")}
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
        className="rounded border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-400/60"
      />
      <button
        onClick={sendChat}
        className="rounded border border-sky-300 bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        disabled={!room}
      >
        {t("room.chat.send")}
      </button>
    </div>
  );
}
