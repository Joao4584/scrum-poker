export class ColorMode {
  private static storageKey = "color-theme";
  private static themes = ["light", "dark"] as const;

  public static get theme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem(this.storageKey);

    if (saved && this.themes.includes(saved as any)) {
      return saved as "light" | "dark";
    }

    return "light";
  }

  public static set theme(value: "light" | "dark") {
    if (typeof window === "undefined") return;

    if (!this.themes.includes(value)) {
      throw new Error(`Tema inválido: ${value}`);
    }

    localStorage.setItem(this.storageKey, value);

    const html = document.documentElement;

    this.themes.forEach((t) => html.classList.remove(t));
    html.classList.add(value);
  }

  public static toggle() {
    this.theme = this.theme === "light" ? "dark" : "light";
  }
}
