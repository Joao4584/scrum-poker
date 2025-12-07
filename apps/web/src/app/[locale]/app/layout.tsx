"use client";

import { Header } from "@/modules/shared/components/header/header";
import { PatternBackgroundContainer } from "@/modules/shared/components/pattern-background-container";
import { Sidebar } from "@/modules/shared/components/side-bar/side-bar";
import { useState, type ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="h-screen bg-background overflow-x-hidden">
      {/* Sidebar */}
      <PatternBackgroundContainer />
      <Header />
      {/* Main Content */}
      <div className="flex h-[calc(100vh-69px)]">
        <Sidebar onItemClick={() => setShowProfile(false)} />
        {/* Content Area */}
        <main className="w-full flex-2 overflow-y-auto">
          <div className="relative ">
            {children}

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute top-4 right-4 z-50">
                {/* UserDropdown component should be imported if needed */}
                {/* <UserDropdown onClose={() => setShowProfile(false)} /> */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
