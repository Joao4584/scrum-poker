import { sanitizeChatMessage } from "@/modules/shared/config/phaser-js/chat-config";
import { useRoomStore } from "../stores/room-store";
import { useRoomUiStore } from "../stores/room-ui-store";

export function useRoomActions() {
  const room = useRoomStore((s) => s.room);
  const focusGame = useRoomStore((s) => s.focusGame);
  const keyboardToggle = useRoomStore((s) => s.keyboardToggle);
  const chatMessage = useRoomUiStore((s) => s.chatMessage);
  const lastChatAt = useRoomUiStore((s) => s.lastChatAt);
  const setChatMessage = useRoomUiStore((s) => s.setChatMessage);
  const setLastChatAt = useRoomUiStore((s) => s.setLastChatAt);
  const setIsGameFocused = useRoomUiStore((s) => s.setIsGameFocused);

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

  const sendChat = () => {
    const trimmed = sanitizeChatMessage(chatMessage);
    if (!trimmed || !room) return;
    const now = Date.now();
    if (now - lastChatAt < 600) return;
    room.send("chat", { text: trimmed });
    setChatMessage("");
    setLastChatAt(now);
  };

  return { sendChat, setGameFocus };
}
