"use client";

import { ReactElement, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCurrentLocale, useI18n } from "@/locales/client";
import { Github, LifeBuoy, LogOut, Settings, SunMoon, User } from "lucide-react";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/modules/shared/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { storageKey } from "@/modules/shared/config/storage-key";
import { openExternalLink } from "@/lib/open-external-link";
import { locales, localesObject } from "@/locales/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/ui/select";
import { ProfileCharacterSelect } from "./profile-character-select";
import { SupportDialog } from "../side-bar/support-dialog";

export function ListContentDropDown(): ReactElement {
  const t = useI18n();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();
  const [supportOpen, setSupportOpen] = useState(false);

  const disconnectAuth = () => {
    deleteCookie(`${storageKey}session`, { path: "/" });
    router.push("/auth");
  };

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const nextThemeLabel = theme === "dark" ? t("dashboard.profile.menu.light") : t("dashboard.profile.menu.dark");
  const changeLocale = (targetLocale: "pt-br" | "en-us") => {
    if (targetLocale === currentLocale) return;

    const segments = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = locales.includes(segments[0] as (typeof locales)[number]);
    const nextSegments = hasLocalePrefix ? [targetLocale, ...segments.slice(1)] : [targetLocale, ...segments];
    const nextPath = `/${nextSegments.join("/")}`;
    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    router.push(`${nextPath}${search}${hash}`);
  };

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
      <div className="px-2 py-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("dashboard.profile.menu.language")}
        </p>
        <Select value={currentLocale} onValueChange={(value) => changeLocale(value as "pt-br" | "en-us")}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-br">{localesObject["pt-br"].name}</SelectItem>
            <SelectItem value="en-us">{localesObject["en-us"].name}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => openExternalLink("https://github.com/Joao4584/scrum-poker")}>
        <Github className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.projectGithub")}</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          setSupportOpen(true);
        }}
      >
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.support")}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={disconnectAuth} className="rounded-bl-full rounded-br-full dark:rounded-bl-xl dark:rounded-br-xl">
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t("dashboard.profile.menu.disconnect")}</span>
      </DropdownMenuItem>
      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </DropdownMenuContent>
  );
}
