"use client";

import { useEffect } from "react";

import { localeCookieKey, localeStorageKey } from "../config/storage-key";

const VALID = new Set(["pt-br", "en-us", "pt", "en"]);

function normalizeLocale(value?: string | null): "pt-br" | "en-us" | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v === "pt-br" || v === "pt") return "pt-br";
  if (v === "en-us" || v === "en") return "en-us";
  return undefined;
}

export function LocaleSync() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(localeStorageKey);
      const normalized = normalizeLocale(stored);
      if (!normalized) return;

      const cookies = document.cookie.split(";").map((c) => c.trim());
      const hasLocaleCookie = cookies.some((c) =>
        c.startsWith(`${localeCookieKey}=`),
      );
      const hasNextLocale = cookies.some((c) => c.startsWith("Next-Locale="));

      const cookieValue = `${localeCookieKey}=${normalized}; path=/; samesite=strict`;
      const nextLocaleValue = `Next-Locale=${normalized}; path=/; samesite=strict`;

      if (!hasLocaleCookie) {
        document.cookie = cookieValue;
      }
      if (!hasNextLocale) {
        document.cookie = nextLocaleValue;
      }
    } catch (err) {
      console.error("LocaleSync error", err);
    }
  }, []);

  return null;
}
