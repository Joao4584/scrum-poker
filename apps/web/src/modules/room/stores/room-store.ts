import { create } from "zustand";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../@types/player";

type RoomState = {
  room?: Room<PlaygroundState>;
  focusGame?: () => void;
  keyboardToggle?: (enabled: boolean) => void;
  setRoom: (room?: Room<PlaygroundState>) => void;
  setFocusGame: (fn?: () => void) => void;
  setKeyboardToggle: (fn?: (enabled: boolean) => void) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  room: undefined,
  focusGame: undefined,
  keyboardToggle: undefined,
  setRoom: (room) => set({ room }),
  setFocusGame: (fn) => set({ focusGame: fn }),
  setKeyboardToggle: (fn) => set({ keyboardToggle: fn }),
}));
