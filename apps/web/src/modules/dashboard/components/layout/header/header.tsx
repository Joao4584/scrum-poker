"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/modules/shared/ui/input";
import { Button } from "@/modules/shared/ui/button";
import { toast } from "sonner";
import { AlertCircle, Share2 } from "lucide-react";
import Image from "next/image";
import UserProfileHeader from "../profile/profile-header";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
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

      toast("Link copiado", { description: "Agora é só enviar para o time.", icon: <AlertCircle /> });
    } catch (error) {
      toast("Nao foi possivel copiar", { description: "Copie manualmente o link da barra de endereco." });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/70 border-b border-border ">
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <Image src="/meta-rtc-logo.png" width={120} height={70} alt="Meta-Scrum" />
        </div>
        {/* Icons */}
        <div className="flex items-center gap-2">
          {isRoomRoute && (
            <Button variant="secondary" size="sm" onClick={handleShareRoom}>
              <Share2 />
              Compartilhar
            </Button>
          )}
          <UserProfileHeader />
        </div>
      </div>
    </header>
  );
}
