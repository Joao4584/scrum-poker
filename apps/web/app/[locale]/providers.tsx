'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';

import { I18nProviderClient } from '@/locales/client';
import { Toaster } from '@/modules/shared/ui/sonner';
import { queryClient } from '@/modules/shared/config/react-query';

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
        themes={['light', 'dark']}
        enableSystem={false}
        disableTransitionOnChange
      >
        <I18nProviderClient locale={locale}>
          {children}

          <Toaster />
        </I18nProviderClient>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
