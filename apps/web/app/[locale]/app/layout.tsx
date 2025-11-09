import { PatternBackgroundContainer } from '@/modules/shared/components/pattern-background-container';
import SideBar from '@/modules/shared/components/side-bar';
import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" min-h-screen  dark:bg-zinc-900 w-full ">
      <PatternBackgroundContainer />
      <SideBar />
      <main className="relative ">
        daw
        <section className="w-full h-full z-10 relative">{children}</section>
      </main>
    </div>
  );
}
