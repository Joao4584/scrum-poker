export function resolveServerUrl() {
  if (process.env.NEXT_PUBLIC_GAME_SERVER_URL) {
    return process.env.NEXT_PUBLIC_GAME_SERVER_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = process.env.NEXT_PUBLIC_GAME_SERVER_PORT ?? "2567";
    return `${protocol}://${host}:${port}`;
  }

  return "ws://localhost:2567";
}
