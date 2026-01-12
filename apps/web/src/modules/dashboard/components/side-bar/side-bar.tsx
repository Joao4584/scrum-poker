"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Divider } from "@/modules/shared/ui/divider";
import { CreateRoom } from "../create-room/create-room";
import MenuList from "./menu-list/menu";
import { Button } from "@/modules/shared/ui/button";
import { cn } from "@/modules/shared/utils";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";

interface SidebarProps {
  onItemClick?: () => void;
  basePath?: string;
}

export function Sidebar({ onItemClick, basePath = "/app" }: SidebarProps) {
  const pathname = usePathname();
  const minimized = useSidebarSizeStore((state) => state.minimized);
  const toggleMinimized = useSidebarSizeStore((state) => state.toggleMinimized);

  return (
    <aside
      className={cn(
        "bg-card/40 border-r border-border relative top-0 h-full overflow-y-auto transition-[width] duration-200",
        minimized ? "w-16" : "w-72",
      )}
    >
      <nav className="flex-1 py-3 space-y-1 ">
        <div className="flex justify-center py-2">
          <CreateRoom />
        </div>
        <Divider />
        <MenuList currentPath={pathname} basePath={basePath} />
        {/* <Button
          className="absolute bottom-3 right-4"
          type="button"
          onClick={toggleMinimized}
        >
          {minimized ? "Expandir" : "Minimizar"}
        </Button> */}
      </nav>
    </aside>
  );
}
