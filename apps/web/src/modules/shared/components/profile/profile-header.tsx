"use client";

import Image from "next/image";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Skeleton } from "../../ui/skeleton";
import { getCurrentGreating } from "../../utils/get-current-greeting";
import { ListContentDropDown } from "./profile-content-dropdown";

interface UserProfileProps {
  className?: string;
}
export default function UserProfileHeader(props: UserProfileProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex relative h-9 pl-5 justify-start gap-2  cursor-pointer  transition-all">
          <div className="flex items-center">
            <div className="relative card bg-slate-400 rounded-full overflow-hidden p-1 bg-opacity-25 h-11 w-11">
              {!avatarLoaded && (
                <Skeleton className="absolute inset-1 rounded-full" aria-hidden="true" />
              )}
              <Image
                src={"/dashboard/default-user-logo.png"}
                className={`rounded-full transition-opacity duration-300 ${
                  avatarLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Perfil"
                width={40}
                height={40}
                onLoadingComplete={() => setAvatarLoaded(true)}
              />
            </div>
          </div>
          {/* <div className="flex justify-center flex-col gap-1.5">
            <span className="text-xs text-slate-300">{getCurrentGreating()}</span>
            <h4 className="text-sm font-semibold" style={{ lineHeight: "7.5px" }}>
              João Roberto
            </h4>
          </div> */}
        </div>
      </DropdownMenuTrigger>
      <ListContentDropDown />
    </DropdownMenu>
  );
}
