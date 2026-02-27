"use client";

import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useI18n } from "@/locales/client";
import { Github, LifeBuoy, LogOut, Settings, SunMoon, User } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/modules/shared/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { storageKey } from "@/modules/shared/config/storage-key";
import { ProfileCharacterSelect } from "./profile-character-select";

export function ListContentDropDown(): ReactElement {
  const t = useI18n();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const disconnectAuth = () => {
    deleteCookie(`${storageKey}session`, { path: "/" });
    router.push("/auth");
  };

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const nextThemeLabel = theme === "dark" ? t("dashboard.profile.menu.light") : t("dashboard.profile.menu.dark");

  return (
    <DropdownMenuContent align="end" sideOffset={12} flushCorner="top-right" className="mr-6 w-64 bg-card/70">
      <ProfileCharacterSelect />
      <DropdownMenuSeparator />
      <DropdownMenuLabel>{t("dashboard.profile.menu.account")}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>{t("dashboard.profile.menu.profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("dashboard.profile.menu.settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={changeTheme}>
          <SunMoon className="mr-2 h-4 w-4" />
          <span>{t("dashboard.profile.menu.themeMode", { mode: nextThemeLabel })}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Github className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.projectGithub")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.support")}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={disconnectAuth} className="rounded-bl-full rounded-br-full dark:rounded-bl-xl dark:rounded-br-xl">
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.disconnect")}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
