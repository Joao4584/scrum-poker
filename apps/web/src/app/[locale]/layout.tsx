import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/assets/globals.css';
import { Providers } from './providers';



export const metadata: Metadata = {
  title: 'Meta RTC - Auth',
  icons: {
    icon: '/icon-logo.png',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased `}
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
