"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Divider } from "@/modules/shared/ui/divider";
import { CreateRoom } from "@/modules/rooms/components/create-room/create-room";
import MenuList from "./menu-list/menu";
import { cn } from "@/modules/shared/utils";
import { useSidebarSizeStore } from "@/modules/workspace/stores/sidebar-size.store";

interface SidebarProps {
  onItemClick?: () => void;
  basePath?: string;
}

export function Sidebar({ onItemClick, basePath = "/app" }: SidebarProps) {
  const pathname = usePathname();
  const minimized = useSidebarSizeStore((state) => state.minimized);

  return (
    <aside
      className={cn("bg-card/40 border-r border-border relative top-0 h-full overflow-y-auto transition-[width] duration-200", minimized ? "w-16" : "w-72")}
    >
      <nav className="flex h-full flex-col py-3">
        <div className="space-y-1">
          <div className="flex justify-center py-2">
            <CreateRoom />
          </div>
          <Divider />
          <MenuList currentPath={pathname} basePath={basePath} />
        </div>
      </nav>
    </aside>
  );
}
