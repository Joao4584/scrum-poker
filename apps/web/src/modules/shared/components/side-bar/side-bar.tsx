import Link from "next/link";
import { CalendarClock, Gauge, LayoutDashboard, MessageSquare, Users, Wand2 } from "lucide-react";

import { cn } from "@/modules/shared/utils";

import ProfileSideBar from "./profile/profile";

const navItems = [
  { label: "Visão geral", icon: LayoutDashboard, href: "/app" },
  { label: "Planning Poker", icon: Gauge, href: "/app/rooms" },
  { label: "Times", icon: Users, href: "/app/teams" },
  { label: "Retrospectiva", icon: MessageSquare, href: "/app/retro" },
  { label: "Agenda", icon: CalendarClock, href: "/app/agenda" },
];

const quickActions = [
  { label: "Criar sala", icon: Wand2, href: "/app/rooms/new" },
  { label: "Convidar time", icon: Users, href: "/app/teams/invite" },
];

const SideBar = () => {
  return (
    <aside className="flex h-full min-h-screen w-72 flex-col border-r">
      <ProfileSideBar />

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900/80 hover:text-emerald-100 transition",
            )}
          >
            <item.icon className="h-4 w-4 text-slate-500 group-hover:text-emerald-300" />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Ações rápidas
        </div>
        {quickActions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-md border border-dashed border-slate-800 px-3 py-2 text-sm font-semibold text-emerald-200 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-100 transition"
          >
            <item.icon className="h-4 w-4 text-emerald-300 group-hover:text-emerald-200" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
        © {new Date().getFullYear()} Scrum Poker
      </div>
    </aside>
  );
};

export default SideBar;
