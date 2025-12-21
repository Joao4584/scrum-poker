"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/modules/shared/utils";
import { Button } from "@/modules/shared/ui/button";
import { Divider } from "@/modules/shared/ui/divider";
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
          <Button
            className="w-5/6 text-white bg-gradient-to-r from-[#1a2f47] via-[#0276B3] to-[#a8601d] bg-[length:200%_200%]
              transition-[background-position] duration-700 ease-in-out hover:bg-[position:100%_50%]"
          >
            <Plus className=" h-4 w-4" />
            Novo
          </Button>
        </div>
        <Divider />
        <MenuList currentPath={pathname} basePath={basePath} />
      </nav>
    </aside>
  );
}
