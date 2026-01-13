export type PhaserGameProps = {
  skin: string;
  userId?: string | null;
};

export type CreatePhaserGameOptions = {
  parent?: HTMLElement | null;
  room: Room<PlaygroundState>;
};
