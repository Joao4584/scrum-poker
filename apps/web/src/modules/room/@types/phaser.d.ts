export type PhaserGameProps = {
  skin: string;
  userId?: string | null;
  displayName?: string | null;
  roomPublicId: string;
};

export type CreatePhaserGameOptions = {
  parent?: HTMLElement | null;
  room: Room<PlaygroundState>;
  backgroundColor?: string;
};
