import { create } from "zustand";

type NearbyState = {
  nearbyPlayers: string[];
  setNearbyPlayers: (players: string[]) => void;
  clearNearbyPlayers: () => void;
};

export const useNearbyStore = create<NearbyState>((set) => ({
  nearbyPlayers: [],
  setNearbyPlayers: (players) => set({ nearbyPlayers: players }),
  clearNearbyPlayers: () => set({ nearbyPlayers: [] }),
}));

export const setNearbyPlayers = (players: string[]) =>
  useNearbyStore.getState().setNearbyPlayers(players);

export const clearNearbyPlayers = () =>
  useNearbyStore.getState().clearNearbyPlayers();
