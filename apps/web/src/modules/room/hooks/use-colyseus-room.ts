import { useEffect, useRef, useState } from "react";
import { Client, type Room } from "colyseus.js";
import type { PlaygroundState } from "../@types/player";
import { buildIdentity } from "../utils/identity";
import { resolveServerUrl } from "../utils/server-url";

type UseColyseusRoomParams = {
  skin: string;
  userId?: string | null;
  displayName?: string | null;
  roomPublicId: string;
};

export function useColyseusRoom({ skin, userId, displayName, roomPublicId }: UseColyseusRoomParams) {
  const roomRef = useRef<Room<PlaygroundState> | null>(null);
  const [room, setRoom] = useState<Room<PlaygroundState> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setRoom(null);

    const connect = async () => {
      try {
        const client = new Client(resolveServerUrl());
        const identity = buildIdentity(userId, displayName);
        const nextRoom = await client.joinOrCreate<PlaygroundState>("playground", {
          id: identity.id ?? undefined,
          name: identity.name,
          color: identity.color,
          skin,
          roomPublicId,
        });

        if (cancelled) {
          await nextRoom.leave();
          return;
        }

        roomRef.current = nextRoom;
        setRoom(nextRoom);
        console.log("[colyseus] joined", nextRoom.roomId, "session", nextRoom.sessionId);
      } catch (err) {
        if (cancelled) return;

        const isAlreadyConnected = err instanceof Error && err.message.includes("ALREADY_CONNECTED");
        if (!isAlreadyConnected) {
          console.error("[colyseus] connection failed", err);
        }

        setError(isAlreadyConnected ? "Ja existe outra guia aberta nesta sala." : "Nao foi possivel conectar ao game-server.");
      }
    };

    connect();

    return () => {
      cancelled = true;
      roomRef.current?.leave();
      roomRef.current = null;
      setRoom(null);
    };
  }, [skin, userId, displayName, roomPublicId]);

  return { room, error };
}
