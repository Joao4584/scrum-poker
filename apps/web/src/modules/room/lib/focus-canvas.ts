export const focusCanvas = (container: HTMLDivElement | null) => {
  const canvas = container?.querySelector("canvas");
  if (!canvas) return;

  canvas.setAttribute("tabindex", "0");
  (canvas as HTMLCanvasElement).focus();
};

export const setKeyboardEnabled = (
  container: HTMLDivElement | null,
  enabled: boolean,
  game: { input?: { keyboard?: { enabled: boolean } } } | null,
) => {
  const canvas = container?.querySelector("canvas") as HTMLCanvasElement | null;
  if (canvas) {
    if (!canvas.hasAttribute("tabindex")) canvas.setAttribute("tabindex", "0");
    if (enabled) canvas.focus();
  }

  if (game?.input?.keyboard) {
    game.input.keyboard.enabled = enabled;
  }
};
