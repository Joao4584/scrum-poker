import { create } from "zustand";
import { getSoundManager } from "@/modules/shared/audio/sound-manager";

type RoomUiState = {
  chatMessage: string;
  lastChatAt: number;
  isGameFocused: boolean;
  invisibleMode: boolean;
  selectedPlayerPublicId: string | null;
  setChatMessage: (value: string) => void;
  setLastChatAt: (value: number) => void;
  setIsGameFocused: (value: boolean) => void;
  setInvisibleMode: (value: boolean) => void;
  toggleInvisibleMode: () => void;
  openPlayerInfoCard: (publicId: string) => void;
  closePlayerInfoCard: () => void;
};

export const useRoomUiStore = create<RoomUiState>((set) => ({
  chatMessage: "",
  lastChatAt: 0,
  isGameFocused: true,
  invisibleMode: false,
  selectedPlayerPublicId: null,
  setChatMessage: (value) => set({ chatMessage: value }),
  setLastChatAt: (value) => set({ lastChatAt: value }),
  setIsGameFocused: (value) => set({ isGameFocused: value }),
  setInvisibleMode: (value) => set({ invisibleMode: value }),
  toggleInvisibleMode: () =>
    set((state) => {
      const nextInvisibleMode = !state.invisibleMode;
      void getSoundManager().play("ui-click", { throttleMs: 40 });
      return { invisibleMode: nextInvisibleMode };
    }),
  openPlayerInfoCard: (publicId) => {
    void getSoundManager().play("ui-click", { throttleMs: 60 });
    set({ selectedPlayerPublicId: publicId });
  },
  closePlayerInfoCard: () => set({ selectedPlayerPublicId: null }),
}));
