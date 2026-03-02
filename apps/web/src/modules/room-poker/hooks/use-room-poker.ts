import type { RoomPokerState } from "../types/poker";

type UseRoomPokerParams = {
  roomPublicId: string;
};

type UseRoomPokerResult = {
  roomPublicId: string;
  state: RoomPokerState | null;
};

export function useRoomPoker({ roomPublicId }: UseRoomPokerParams): UseRoomPokerResult {
  return {
    roomPublicId,
    state: null,
  };
}
