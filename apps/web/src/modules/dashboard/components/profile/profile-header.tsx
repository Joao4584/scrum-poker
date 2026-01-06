"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "@/modules/shared/ui/dropdown-menu";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { getCurrentGreating } from "@/modules/shared/utils/get-current-greeting";
import { ListContentDropDown } from "./profile-content-dropdown";
import { useUser } from "../../hooks/use-user";

interface UserProfileProps {
  className?: string;
}
export default function UserProfileHeader(props: UserProfileProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const { data, isLoading, isError } = useUser();
  const fullName = data?.name?.trim();

  const displayName = fullName ? fullName.split(/\s+/).slice(0, 2).join(" ") : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex relative h-9 pl-5 justify-start gap-2  cursor-pointer  transition-all">
          <div className="flex items-center">
            <div className="relative card bg-slate-400 rounded-full overflow-hidden p-1 bg-opacity-25 h-11 w-11">
              {!avatarLoaded && <Skeleton className="absolute inset-1 rounded-full" aria-hidden="true" />}
              <Image
                src={data?.avatar_url ?? "/dashboard/default-user-logo.png"}
                className={`rounded-full transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
                alt="Perfil"
                width={40}
                height={40}
                onLoad={() => setAvatarLoaded(true)}
              />
            </div>
          </div>
          <div className="flex  justify-center flex-col gap-1.5">
            {displayName ? (
              <React.Fragment>
                <span className="text-xs text-slate-300">{getCurrentGreating()}</span>
                <h4 className="text-sm font-semibold no-break " style={{ lineHeight: "10px" }}>
                  {displayName}
                </h4>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Skeleton className="w-full h-3 mt-1" />
                <Skeleton className="w-full h-4 mt-1" />
              </React.Fragment>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <ListContentDropDown />
    </DropdownMenu>
  );
}
