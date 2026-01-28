"use client";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  SunMoon,
  UserPlus,
  Users,
} from "lucide-react";

import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/modules/shared/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { storageKey } from "@/modules/shared/config/storage-key";
import { ProfileCharacterSelect } from "./profile-character-select";

export function ListContentDropDown(): ReactElement {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const disconnectAuth = () => {
    deleteCookie(`${storageKey}session`, { path: "/" });
    router.push("/auth");
  };

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <DropdownMenuContent align="end" sideOffset={12} flushCorner="top-right" className="w-64 mr-6 bg-card/70">
      <ProfileCharacterSelect />
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="">Minha Conta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Atalhos de Teclado</span>
          <DropdownMenuShortcut className="text-xs">ctrl + /</DropdownMenuShortcut>
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={changeTheme}>
          <SunMoon className="mr-2 h-4 w-4" />
          <span>Modo {theme === "dark" ? "Claro" : "Escuro"}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Github className="mr-2 h-4 w-4" />
        <span>GitHub (Projeto)</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Suporte</span>
      </DropdownMenuItem>
      {/* <DropdownMenuItem disabled>
        <Cloud className="mr-2 h-4 w-4" />
        <span>API</span>
      </DropdownMenuItem> */}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={disconnectAuth} className="rounded-bl-full dark:rounded-bl-xl rounded-br-full dark:rounded-br-xl">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Desconectar</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
