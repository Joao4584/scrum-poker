"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useI18n } from "@/locales/client";
import { DropdownMenu, DropdownMenuTrigger } from "@/modules/shared/ui/dropdown-menu";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { getLevelTheme } from "@/modules/shared/utils/level-theme";
import { ListContentDropDown } from "./profile-content-dropdown";
import { useUser } from "../../../hooks/use-user";
import { useCharacterStore } from "@/modules/room/stores/character.store";
import { useExperience } from "@/modules/shared/hooks/use-experience";
import { NumberTicker } from "@/components/ui/number-ticker";

interface UserProfileProps {
  className?: string;
}

function getGreetingKeyByHour(hour: number) {
  if (hour >= 6 && hour < 12) return "dashboard.profile.header.greeting.morning" as const;
  if (hour >= 12 && hour < 18) return "dashboard.profile.header.greeting.afternoon" as const;
  return "dashboard.profile.header.greeting.evening" as const;
}

export default function UserProfileHeader(_props: UserProfileProps) {
  const t = useI18n();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const { data } = useUser();
  const { characterKey, setCharacterKey } = useCharacterStore();
  const xp = data?.xp ?? 0;
  const { level, xpToNextLevel } = useExperience(xp);
  const levelTheme = getLevelTheme(level);
  const greeting = t(getGreetingKeyByHour(new Date().getHours()));

  const fullName = data?.name?.trim();
  const displayName = fullName ? fullName.split(/\s+/).slice(0, 2).join(" ") : null;

  useEffect(() => {
    if (data?.character_key && data.character_key !== characterKey) {
      setCharacterKey(data.character_key);
    }
  }, [characterKey, data?.character_key, setCharacterKey]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative flex h-9 justify-start gap-2 pl-5 transition-all">
          <div className="flex items-center">
            <div className="relative h-11 w-11">
              <div
                className="card h-11 w-11 overflow-hidden rounded-full border p-1"
                style={{
                  backgroundColor: levelTheme.ui.accentSoft,
                  borderColor: levelTheme.ui.accentStrong,
                  boxShadow: `0 0 0 1px ${levelTheme.ui.accentSoft} inset`,
                }}
              >
                {!avatarLoaded && <Skeleton className="absolute inset-1 rounded-full" aria-hidden="true" />}
                <Image
                  src={data?.avatar_url ?? "/dashboard/default-user-logo.png"}
                  className={`rounded-full transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
                  alt={t("dashboard.profile.header.avatarAlt")}
                  width={40}
                  height={40}
                  onLoad={() => setAvatarLoaded(true)}
                />
              </div>
              <div
                className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center text-[10px] font-semibold shadow"
                style={{
                  backgroundColor: levelTheme.ui.accentHex,
                  color: levelTheme.ui.textOnAccent,
                  boxShadow: `0 4px 14px -6px ${levelTheme.ui.accentHex}`,
                  clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
                }}
                title={t("dashboard.profile.header.levelTooltip", { xp: xpToNextLevel })}
                aria-label={t("dashboard.profile.header.levelAria", { level })}
              >
                <NumberTicker value={level} direction="up" className="font-bold" style={{ color: levelTheme.ui.textOnAccent }} />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            {displayName ? (
              <React.Fragment>
                <span className="text-xs text-slate-300">{greeting}</span>
                <h4 className="no-break text-sm font-semibold" style={{ lineHeight: "10px" }}>
                  {displayName}
                </h4>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Skeleton className="mt-1 h-3 w-full" />
                <Skeleton className="mt-1 h-4 w-full" />
              </React.Fragment>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <ListContentDropDown />
    </DropdownMenu>
  );
}
