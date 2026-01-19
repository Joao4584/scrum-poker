"use client";

import { useEffect, useRef } from "react";
import { getCookie } from "cookies-next";
import { storageKey } from "@/modules/shared/config/storage-key";

type DashboardActionType = "friend_request" | "page_invite" | "system";

type DashboardEvent =
  | {
      event: "ready";
      data: { userId: string; name: string };
    }
  | {
      event: "message";
      data: {
        roomId: string;
        message: string;
        userId: string;
        name: string;
        targetUserId?: string | null;
      };
    }
  | {
      event: "action";
      data: {
        roomId: string;
        actionType: DashboardActionType;
        title: string;
        message?: string | null;
        targetUserId?: string | null;
        userId: string;
        name: string;
      };
    }
  | { event: "join"; data?: unknown };

type DashboardSocketOptions = {
  roomId?: string;
  onMessage?: (data: DashboardEvent & { event: "message" }) => void;
  onAction?: (data: DashboardEvent & { event: "action" }) => void;
  onReady?: (data: DashboardEvent & { event: "ready" }) => void;
  onAny?: (data: DashboardEvent) => void;
};

type SendActionInput = {
  actionType: DashboardActionType;
  title: string;
  message?: string;
  targetUserId?: string;
};

export function useDashboardSocket({
  roomId,
  onMessage,
  onAction,
  onReady,
  onAny,
}: DashboardSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = getCookie(`${storageKey}session`);
    if (!token) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_WS_URL ?? window.location.origin;
    const wsUrl = new URL("/ws/dashboard", baseUrl);
    if (wsUrl.protocol === "https:") {
      wsUrl.protocol = "wss:";
    } else if (wsUrl.protocol === "http:") {
      wsUrl.protocol = "ws:";
    }
    wsUrl.searchParams.set("token", String(token));

    const socket = new WebSocket(wsUrl.toString());
    socketRef.current = socket;

    const handleMessage = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as DashboardEvent;
        onAny?.(payload);
        if (payload.event === "message") {
          onMessage?.(payload);
        }
        if (payload.event === "action") {
          onAction?.(payload);
        }
        if (payload.event === "ready") {
          onReady?.(payload);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    socket.addEventListener("open", () => {
      if (!roomId) return;
      socket.send(
        JSON.stringify({
          event: "join",
          data: { roomId },
        }),
      );
    });
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [roomId, onMessage, onAction, onReady, onAny]);

  const sendMessage = (message: string, targetUserId?: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload: DashboardEvent = {
      event: "message",
      data: { roomId, message, targetUserId },
    };
    socket.send(JSON.stringify(payload));
  };

  const sendAction = (input: SendActionInput) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload = {
      event: "action",
      data: { roomId, ...input },
    };
    socket.send(JSON.stringify(payload));
  };

  return { socketRef, sendMessage, sendAction };
}
