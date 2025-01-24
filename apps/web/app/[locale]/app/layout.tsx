import type { ReactNode } from 'react';
import type React from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
