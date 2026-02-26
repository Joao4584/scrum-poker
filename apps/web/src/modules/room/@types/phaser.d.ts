export type PhaserGameProps = {
  skin: string;
  level?: number;
  ghost?: boolean;
  userId?: string | null;
  displayName?: string | null;
  roomPublicId: string;
  onSceneReady?: () => void;
  onRoomConnected?: () => void;
};

export type CreatePhaserGameOptions = {
  parent?: HTMLElement | null;
  room: Room<PlaygroundState>;
  backgroundColor?: string;
  onSceneReady?: () => void;
};
