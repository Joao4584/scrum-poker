import { useEffect, useRef, useState } from "react";
import { Client, type Room } from "colyseus.js";
import type { PlaygroundState } from "../@types/player";
import { buildIdentity } from "../utils/identity";
import { resolveServerUrl } from "../utils/server-url";

type UseColyseusRoomParams = {
  skin: string;
  level?: number;
  ghost?: boolean;
  userId?: string | null;
  displayName?: string | null;
  roomPublicId: string;
};

export function useColyseusRoom({ skin, level, ghost, userId, displayName, roomPublicId }: UseColyseusRoomParams) {
  const roomRef = useRef<Room<PlaygroundState> | null>(null);
  const [room, setRoom] = useState<Room<PlaygroundState> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setRoom(null);

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const connect = async () => {
      try {
        const client = new Client(resolveServerUrl());
        const identity = buildIdentity(userId, displayName);
        const joinOptions = {
          id: identity.id ?? undefined,
          name: identity.name,
          color: identity.color,
          skin,
          level,
          ghost: !!ghost,
          roomPublicId,
        };

        let lastAlreadyConnectedError: Error | null = null;
        const maxAlreadyConnectedRetries = 5;

        for (let attempt = 0; attempt <= maxAlreadyConnectedRetries; attempt++) {
          if (cancelled) return;

          try {
            const nextRoom = await client.joinOrCreate<PlaygroundState>("playground", joinOptions);

            if (cancelled) {
              await nextRoom.leave();
              return;
            }

            roomRef.current = nextRoom;
            setRoom(nextRoom);
            console.log("[colyseus] joined", nextRoom.roomId, "session", nextRoom.sessionId);
            return;
          } catch (err) {
            const isAlreadyConnected = err instanceof Error && err.message.includes("ALREADY_CONNECTED");
            if (!isAlreadyConnected) {
              throw err;
            }

            lastAlreadyConnectedError = err;
            if (attempt >= maxAlreadyConnectedRetries) {
              break;
            }

            const retryDelayMs = 250 + attempt * 250;
            console.warn(`[colyseus] ALREADY_CONNECTED (tentativa ${attempt + 1}), retry em ${retryDelayMs}ms`);
            await sleep(retryDelayMs);
          }
        }

        throw (lastAlreadyConnectedError ?? new Error("ALREADY_CONNECTED"));
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
