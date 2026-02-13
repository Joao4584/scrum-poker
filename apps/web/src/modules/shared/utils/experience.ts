export const DEFAULT_LEVEL_XP = 45;

export interface ExperienceProgress {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  levelXp: number;
}

export function getExperienceProgress(xp: number, levelXp: number = DEFAULT_LEVEL_XP): ExperienceProgress {
  const safeXp = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
  const safeLevelXp = Number.isFinite(levelXp) && levelXp > 0 ? Math.floor(levelXp) : DEFAULT_LEVEL_XP;

  const level = Math.floor(safeXp / safeLevelXp);
  const currentLevelXp = safeXp - level * safeLevelXp;
  const nextLevelXp = (level + 1) * safeLevelXp;
  const xpToNextLevel = Math.max(nextLevelXp - safeXp, 0);

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    xpToNextLevel,
    levelXp: safeLevelXp,
  };
}
