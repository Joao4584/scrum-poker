"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Divider } from "@/modules/shared/ui/divider";
import { CreateRoom } from "../create-room/create-room";
import MenuList from "./menu-list/menu";

interface SidebarProps {
  onItemClick?: () => void;
  basePath?: string;
}

export function Sidebar({ onItemClick, basePath = "/app" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-card/40 border-r border-border relative top-0 h-full overflow-y-auto">
      <nav className="flex-1 py-3 space-y-1 ">
        <div className="flex justify-center py-2">
          <CreateRoom />
        </div>
        <Divider />
        <MenuList currentPath={pathname} basePath={basePath} />
      </nav>
    </aside>
  );
}
