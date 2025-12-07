import type { LucideIcon } from "lucide-react";
import { Bell, Kanban, PanelsLeftBottom } from "lucide-react";

export interface RouteProps {
  title: string;
  icon: LucideIcon;
  path: string;
}

export interface RouteGroup {
  groupName: string;
  icon: LucideIcon;
  routes: RouteProps[];
}

export type RouteDefinition = RouteProps | RouteGroup;

export const routeDashboard: RouteDefinition[] = [
  {
    title: "Overview",
    icon: PanelsLeftBottom,
    path: "/",
  },
  {
    title: "Notificacoes",
    icon: Bell,
    path: "/notification",
  },
  {
    title: "Projetos",
    icon: Kanban,
    path: "/projects",
  },
  // {
  //   title: "Conexoes",
  //   icon: TbNetwork,
  //   path: "/connections",
  // },
  // {
  //   title: "Logs",
  //   icon: FaReceipt,
  //   path: "/logs",
  // },
  // {
  //   groupName: "Configuracoes",
  //   icon: RiSettings2Fill,
  //   routes: [
  //     {
  //       title: "Gerais",
  //       icon: MdOutlineBroadcastOnHome,
  //       path: "/config",
  //     },
  //     {
  //       title: "Usuarios",
  //       icon: TiUser,
  //       path: "/config/users",
  //     },
  //     {
  //       title: "Grupos",
  //       icon: FaUsers,
  //       path: "/config/groups",
  //     },
  //   ],
  // },
];
