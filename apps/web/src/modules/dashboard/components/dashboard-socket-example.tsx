"use client";

import { useEffect } from "react";
import { useDashboardSocket } from "@/modules/dashboard/websocket/dashboard-socket";

export function DashboardSocketExample() {
  const { socketRef, sendMessage } = useDashboardSocket("dashboard");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.event === "message") {
          // eslint-disable-next-line no-console
          console.log("dashboard message", payload.data);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socketRef]);

  return (
    <button type="button" onClick={() => sendMessage("ola do dashboard")}>    
      Testar socket
    </button>
  );
}
