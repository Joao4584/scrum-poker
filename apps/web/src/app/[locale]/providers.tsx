"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";

import { I18nProviderClient } from "@/locales/client";
import { Toaster } from "@/modules/shared/ui/sonner";
import { queryClient } from "@/modules/shared/config/react-query";
import { LocaleSync } from "@/modules/shared/components/locale-sync";
import { LocalePersist } from "@/modules/shared/components/locale-persist";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        themes={["light", "dark"]}
        enableSystem={false}
        disableTransitionOnChange
      >
        <I18nProviderClient locale={locale}>
          <LocalePersist locale={locale as "pt-br" | "en-us"} />
          {children}

          <Toaster />
          <LocaleSync />
        </I18nProviderClient>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
