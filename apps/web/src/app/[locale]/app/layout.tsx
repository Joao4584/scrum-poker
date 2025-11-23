import Header from "@/modules/shared/components/header/header";
import { PatternBackgroundContainer } from "@/modules/shared/components/pattern-background-container";
import SideBar from "@/modules/shared/components/side-bar/side-bar";
import type { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" min-h-screen flex  dark:bg-zinc-900 w-full ">
      <PatternBackgroundContainer />
      <SideBar />
      <main className="relative w-full h-full">
        <Header />
        <section className="w-full h-full z-10 relative px-8 py-6">
          {children}
        </section>
      </main>
    </div>
  );
}
