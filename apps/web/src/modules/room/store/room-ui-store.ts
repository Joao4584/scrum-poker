import { create } from "zustand";

type RoomUiState = {
  name: string;
  chatMessage: string;
  lastChatAt: number;
  isGameFocused: boolean;
  setName: (value: string) => void;
  setChatMessage: (value: string) => void;
  setLastChatAt: (value: number) => void;
  setIsGameFocused: (value: boolean) => void;
};

export const useRoomUiStore = create<RoomUiState>((set) => ({
  name: "",
  chatMessage: "",
  lastChatAt: 0,
  isGameFocused: true,
  setName: (value) => set({ name: value }),
  setChatMessage: (value) => set({ chatMessage: value }),
  setLastChatAt: (value) => set({ lastChatAt: value }),
  setIsGameFocused: (value) => set({ isGameFocused: value }),
}));
