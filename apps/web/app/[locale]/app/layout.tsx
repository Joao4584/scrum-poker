import { PatternBackgroundContainer } from '@/modules/shared/components/pattern-background-container';
import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen  dark:bg-zinc-900 w-full ">
      <PatternBackgroundContainer />
      <div className=" ">
        HEader
        <main className="relative ">
          <section className="w-full h-full z-10 relative">{children}</section>
        </main>
      </div>
    </div>
  );
}
