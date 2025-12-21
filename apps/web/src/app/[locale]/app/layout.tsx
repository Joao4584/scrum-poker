"use client";

import { Header } from "@/modules/dashboard/components/header/header";
import { PatternBackgroundContainer } from "@/modules/shared/components/pattern-background-container";
import { Sidebar } from "@/modules/dashboard/components/side-bar/side-bar";
import { useState, type ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="h-screen bg-background overflow-x-hidden">
      <PatternBackgroundContainer />
      <Header />
      <div className="flex h-[calc(100vh-69px)]">
        <Sidebar onItemClick={() => setShowProfile(false)} />
        <main className="w-full flex-2 overflow-y-auto p-2.5">{children}</main>
      </div>
    </div>
  );
}
