"use client";

import { getSoundManager } from "../audio/sound-manager";

export function useSounds() {
  return getSoundManager();
}
