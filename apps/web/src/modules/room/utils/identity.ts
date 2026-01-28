import * as Phaser from "phaser";

type Identity = {
  id: string | null;
  name: string;
  color?: string;
};

function randomName() {
  return `Guest-${Math.floor(Math.random() * 9_000 + 1_000)}`;
}

export function buildIdentity(userId?: string | null, displayName?: string | null): Identity {
  const id = userId ?? null;
  const normalizedName = displayName?.trim();
  const name = normalizedName && normalizedName.length > 0
    ? normalizedName
    : id
      ? `User-${id}`
      : randomName();
  const colorFromId = () => {
    if (!id) return undefined;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    return `#${Phaser.Display.Color.HSLToColor(hue / 360, 0.55, 0.6)
      .color.toString(16)
      .padStart(6, "0")}`;
  };
  return { id, name, color: colorFromId() };
}
