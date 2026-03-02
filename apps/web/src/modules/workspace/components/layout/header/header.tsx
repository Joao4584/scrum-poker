"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/locales/client";
import { Button } from "@/modules/shared/ui/button";
import { toast } from "sonner";
import { AlertCircle, Share2 } from "lucide-react";
import Image from "next/image";
import UserProfileHeader from "@/modules/profile/components/layout/profile/profile-header";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const t = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isRoomRoute = Boolean(pathname?.includes("/app/room/"));

  const handleShareRoom = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = url;
        tempInput.setAttribute("readonly", "true");
        tempInput.style.position = "fixed";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      toast(t("dashboard.header.copySuccessTitle"), {
        description: t("dashboard.header.copySuccessDescription"),
        icon: <AlertCircle />,
      });
    } catch {
      toast(t("dashboard.header.copyErrorTitle"), {
        description: t("dashboard.header.copyErrorDescription"),
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/70">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-fit items-center gap-2">
          <Image src="/meta-rtc-logo.png" width={120} height={70} alt="Meta-Scrum" />
        </div>
        <div className="flex items-center gap-2">
          {isRoomRoute && (
            <Button variant="secondary" size="sm" onClick={handleShareRoom}>
              <Share2 />
              {t("dashboard.header.share")}
            </Button>
          )}
          <UserProfileHeader />
        </div>
      </div>
    </header>
  );
}
