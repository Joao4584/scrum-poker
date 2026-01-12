import { create } from "zustand";

type SidebarSizeState = {
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  toggleMinimized: () => void;
};

export const useSidebarSizeStore = create<SidebarSizeState>((set) => ({
  minimized: false,
  setMinimized: (minimized) => set({ minimized }),
  toggleMinimized: () => set((state) => ({ minimized: !state.minimized })),
}));
