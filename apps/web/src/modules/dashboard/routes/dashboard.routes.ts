import type { LucideIcon } from "lucide-react";
import { Bell, Kanban, PanelsLeftBottom, Clock8, Trash2, Users } from "lucide-react";

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

type RoutePropsConfig = Omit<RouteProps, "title"> & {
  titleKey: string;
  fallback: string;
};

type RouteGroupConfig = Omit<RouteGroup, "groupName" | "routes"> & {
  groupKey: string;
  groupFallback: string;
  routes: RoutePropsConfig[];
};

export type RouteDefinitionConfig = RoutePropsConfig | RouteGroupConfig;

export const routeDashboardConfig: RouteDefinitionConfig[] = [
  {
    titleKey: "dashboard.menu.recent",
    fallback: "recent",
    icon: Clock8,
    path: "/",
  },
  {
    titleKey: "dashboard.menu.friends",
    fallback: "friends",
    icon: Users,
    path: "/friends",
  },
  {
    titleKey: "dashboard.menu.trash",
    fallback: "trash",
    icon: Trash2,
    path: "/trash",
  },
];

export function getDashboardRoutes(t: (key: string, params?: Record<string, unknown>) => string): RouteDefinition[] {
  const translateRoute = (route: RoutePropsConfig): RouteProps => ({
    title: t(route.titleKey) ?? route.fallback,
    icon: route.icon,
    path: route.path,
  });

  return routeDashboardConfig.map((item) => {
    if ("groupKey" in item) {
      const group = item as RouteGroupConfig;
      return {
        groupName: t(group.groupKey) ?? group.groupFallback,
        icon: group.icon,
        routes: group.routes.map(translateRoute),
      };
    }
    return translateRoute(item as RoutePropsConfig);
  });
}
