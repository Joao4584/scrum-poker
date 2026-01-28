import { create } from "zustand";

type CharacterState = {
  characterKey: string;
  setCharacterKey: (characterKey: string) => void;
};

export const useCharacterStore = create<CharacterState>((set) => ({
  characterKey: "steve",
  setCharacterKey: (characterKey) => set({ characterKey }),
}));
