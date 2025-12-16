import { useState } from "react";
import { Input } from "@/modules/shared/ui/input";
import Image from "next/image";
import UserProfileHeader from "../profile/profile-header";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card/70 border-b border-border ">
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <Image src="/meta-rtc-logo.png" width={120} height={70} alt="Meta-Scrum" />
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="pl-4 pr-4 py-2 bg-secondary text-foreground rounded-full text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Ctrl K
            </span>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <UserProfileHeader />
        </div>
      </div>
    </header>
  );
}
