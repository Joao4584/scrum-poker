export const CHAT_MESSAGE_MAX_CHARS = 140;
export const CHAT_HIDE_DELAY_MS = 15_000;

export function sanitizeChatMessage(raw: string) {
  return raw.replace(/\s+/g, " ").trim().slice(0, CHAT_MESSAGE_MAX_CHARS);
}
