import {
  PLAYER_RADIUS_Y_OFFSET,
  PLAYER_RADIUS_Y_SCALE,
} from "./player-radius";

export type RemoteSummary = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export function getNearbyPlayers(
  remotes: RemoteSummary[],
  centerX: number,
  centerY: number,
  radius: number,
) {
  const rx = radius;
  const ry = radius * PLAYER_RADIUS_Y_SCALE;
  const nearby = remotes
    .map((remote) => {
      const dx = remote.x - centerX;
      const dy = remote.y - (centerY + PLAYER_RADIUS_Y_OFFSET);
      const ellipse = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (ellipse > 1) return null;
      return {
        name: remote.name,
        distance: Math.sqrt(dx * dx + dy * dy),
      };
    })
    .filter((entry): entry is { name: string; distance: number } => !!entry)
    .sort((a, b) => a.distance - b.distance)
    .map((entry) => entry.name);

  return nearby;
}
