const allowedSkins = ["steve", "jerry", "mark", "sarah"] as const;

export function sanitizeColor(color?: string | null, fallback = "#27c498") {
  if (!color || typeof color !== "string") return fallback;
  const match = color.match(/^#?[0-9a-fA-F]{6}$/);
  if (!match) return fallback;
  return color.startsWith("#") ? color : `#${color}`;
}

export function sanitizeName(name?: string | null, fallback: string) {
  if (!name) return fallback;
  const trimmed = name.toString().trim().slice(0, 32);
  return trimmed || fallback;
}

export function sanitizeId(id?: string | null, fallback: string) {
  if (!id) return fallback;
  return id.toString().slice(0, 32);
}

export function sanitizeSkin(skin?: string | null) {
  if (!skin) return "steve";
  const value = skin.toString().toLowerCase();
  if (allowedSkins.includes(value as (typeof allowedSkins)[number])) return value;
  return "steve";
}

export function sanitizeMessage(raw?: string | null) {
  if (!raw || typeof raw !== "string") return "";
  const cleaned = raw.replace(/[\r\n\t]+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.slice(0, 120);
}
