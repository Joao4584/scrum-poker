import type { ReactNode } from 'react';
import type React from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return <main className="w-full h-full bg-slate-50">{children}</main>;
}
