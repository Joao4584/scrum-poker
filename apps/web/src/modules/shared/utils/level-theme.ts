export type LevelThemeTier = "gray" | "blue" | "yellow" | "beige" | "red";

type LevelTheme = {
  tier: LevelThemeTier;
  label: string;
  ui: {
    accentHex: string;
    accentRgb: string;
    accentSoft: string;
    accentStrong: string;
    textOnAccent: string;
  };
  phaser: {
    badgeFill: number;
    levelText: string;
  };
};

type LevelThemeRange = {
  min: number;
  max: number;
  theme: LevelTheme;
};

const LEVEL_THEME_RANGES: LevelThemeRange[] = [
  {
    min: 0,
    max: 9,
    theme: createTheme("gray", "Iniciante", "#64748B", "#E2E8F0"),
  },
  {
    min: 10,
    max: 24,
    theme: createTheme("blue", "Experiente", "#2563EB", "#DBEAFE"),
  },
  {
    min: 25,
    max: 49,
    theme: createTheme("yellow", "Elite", "#EAB308", "#1F2937"),
  },
  {
    min: 50,
    max: 74,
    theme: createTheme("beige", "Veterano", "#D6B58A", "#1F2937"),
  },
  {
    min: 75,
    max: Number.POSITIVE_INFINITY,
    theme: createTheme("red", "Lendario", "#DC2626", "#FEE2E2"),
  },
];

function createTheme(tier: LevelThemeTier, label: string, accentHex: string, textOnAccent: string): LevelTheme {
  const accentRgb = hexToRgbTuple(accentHex);
  return {
    tier,
    label,
    ui: {
      accentHex,
      accentRgb,
      accentSoft: `rgba(${accentRgb}, 0.14)`,
      accentStrong: `rgba(${accentRgb}, 0.3)`,
      textOnAccent,
    },
    phaser: {
      badgeFill: hexToPhaserNumber(accentHex),
      levelText: textOnAccent,
    },
  };
}

function hexToRgbTuple(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3 ? normalized.split("").map((c) => `${c}${c}`).join("") : normalized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

function hexToPhaserNumber(hex: string) {
  return Number.parseInt(hex.replace("#", ""), 16);
}

export function getLevelTheme(level?: number | null): LevelTheme {
  const safeLevel = Math.max(0, Number(level ?? 0));
  return LEVEL_THEME_RANGES.find((range) => safeLevel >= range.min && safeLevel <= range.max)?.theme ?? LEVEL_THEME_RANGES[0]!.theme;
}
