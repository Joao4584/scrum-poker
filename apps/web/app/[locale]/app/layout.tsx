import { PointerWrapper } from '@/modules/shared/components/pointer';
import type { ReactNode } from 'react';
import type React from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return <main className="w-full h-full ">{children}</main>;
}
