import { create } from "zustand";

type RoomUiState = {
  chatMessage: string;
  lastChatAt: number;
  isGameFocused: boolean;
  setChatMessage: (value: string) => void;
  setLastChatAt: (value: number) => void;
  setIsGameFocused: (value: boolean) => void;
};

export const useRoomUiStore = create<RoomUiState>((set) => ({
  chatMessage: "",
  lastChatAt: 0,
  isGameFocused: true,
  setChatMessage: (value) => set({ chatMessage: value }),
  setLastChatAt: (value) => set({ lastChatAt: value }),
  setIsGameFocused: (value) => set({ isGameFocused: value }),
}));
