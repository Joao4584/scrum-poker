import { useMemo } from "react";
import { DEFAULT_LEVEL_XP, getExperienceProgress } from "@/modules/shared/utils/experience";

export function useExperience(xp: number, levelXp: number = DEFAULT_LEVEL_XP) {
  return useMemo(() => getExperienceProgress(xp, levelXp), [xp, levelXp]);
}
