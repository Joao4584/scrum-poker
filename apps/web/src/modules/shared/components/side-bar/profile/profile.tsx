"use client";
import { useState } from "react";
import { ChevronsUpDown, LogOut, Settings2, User2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";

export default function ProfileSideBar() {
  return (
    <div className="w-full border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 border border-slate-800">
          <AvatarImage src="" alt="Perfil" />
          <AvatarFallback className="bg-slate-800 text-slate-200">JR</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-slate-100 leading-tight">João Ribeiro</div>
          <div className="text-xs text-slate-400">joao@scrum-poker.dev</div>
        </div>
      </div>
    </div>
  );
}
