import { getCookie } from "cookies-next";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { storageKey } from "@/modules/shared/config/storage-key";
import type { PlanningQuestion } from "../services/get-room-questions";
import type { PlanningConnectionStatus, RoomPokerState } from "../types/poker";

type PlanningSyncPayload = {
  event: string;
  roomPublicId: string;
  occurredAt: string;
  questions?: PlanningQuestion[];
};

type UseRoomPokerParams = {
  roomPublicId: string;
  onSync?: (payload: PlanningSyncPayload) => void;
};

type UseRoomPokerResult = {
  roomPublicId: string;
  state: RoomPokerState | null;
  pageId: string;
  socketId: string | null;
  status: PlanningConnectionStatus;
};

function resolvePlanningSocketUrl() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
  }

  return process.env.NEXT_PUBLIC_WS_URL ?? window.location.origin;
}

function createPageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useRoomPoker({ roomPublicId, onSync }: UseRoomPokerParams): UseRoomPokerResult {
  const pageIdRef = useRef<string>(createPageId());
  const [socketId, setSocketId] = useState<string | null>(null);
  const [status, setStatus] = useState<PlanningConnectionStatus>("idle");

  useEffect(() => {
    const token = getCookie(`${storageKey}session`);
    if (!token || typeof token !== "string") {
      setStatus("error");
      return;
    }

    setStatus("connecting");

    const socket = io(resolvePlanningSocketUrl(), {
      path: "/ws/planning",
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token,
        roomPublicId,
        pageId: pageIdRef.current,
      },
    });

    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
      setStatus("connected");
      console.log("[planning] connected", {
        roomPublicId,
        pageId: pageIdRef.current,
        socketId: socket.id ?? null,
      });
      socket.emit("planning:join", {
        roomPublicId,
        pageId: pageIdRef.current,
      });
    });

    socket.on("disconnect", () => {
      console.log("[planning] disconnected", {
        roomPublicId,
        pageId: pageIdRef.current,
        socketId: socket.id ?? null,
      });
      setStatus("idle");
      setSocketId(null);
    });

    socket.on("connect_error", () => {
      console.error("[planning] connection error", {
        roomPublicId,
        pageId: pageIdRef.current,
      });
      setStatus("error");
      setSocketId(null);
    });

    socket.on("planning:sync", (payload: PlanningSyncPayload) => {
      console.log("[planning] sync", payload);
      onSync?.(payload);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      setSocketId(null);
      setStatus("idle");
    };
  }, [onSync, roomPublicId]);

  return {
    roomPublicId,
    state: null,
    pageId: pageIdRef.current,
    socketId,
    status,
  };
}
