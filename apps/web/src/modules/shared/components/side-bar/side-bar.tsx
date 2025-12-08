"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../../utils";
import { Button } from "../../ui/button";
import { Divider } from "../../ui/divider";
import MenuList from "./menu";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  onItemClick?: () => void;
  basePath?: string;
}

export function Sidebar({ onItemClick, basePath = "/app" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-card/40 border-r border-border relative top-0 h-full overflow-y-auto">
      <nav className="flex-1 py-3 space-y-1 ">
        <MenuList currentPath={pathname} basePath={basePath} />
      </nav>
    </aside>
  );
}
