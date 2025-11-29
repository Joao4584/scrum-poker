"use client";

import { useEffect } from "react";

import { localeCookieKey, localeStorageKey } from "../config/storage-key";

type Locale = "pt-br" | "en-us";

type Props = {
  locale: Locale;
};

export function LocalePersist({ locale }: Props) {
  useEffect(() => {
    try {
      localStorage.setItem(localeStorageKey, locale);
      document.cookie = `${localeCookieKey}=${locale}; path=/; samesite=strict`;
      document.cookie = `Next-Locale=${locale}; path=/; samesite=strict`;
    } catch {}
  }, [locale]);

  return null;
}
