import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/locales/client";
import {
  RouteDefinition,
  RouteProps,
  RouteGroup,
  getDashboardRoutes,
} from "@/modules/dashboard/routes/dashboard.routes";
import { motion } from "framer-motion";
import { cn } from "@/modules/shared/utils";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";
import GroupMenu from "./group-menu";
import SingleMenu from "./single-menu";

interface MenuListProps {
  currentPath: string;
  basePath: string;
}

export default function MenuList({ currentPath, basePath }: MenuListProps) {
  const router = useRouter();
  const t = useI18n();
  const normalizedBasePath = useMemo(() => (basePath.endsWith("/") ? basePath.slice(0, -1) : basePath), [basePath]);
  const activeSegment = useMemo(() => {
    const relative = (currentPath.split(`${normalizedBasePath}/`)[1] || "").split("/")[0];
    return relative;
  }, [currentPath, normalizedBasePath]);
  const routes = useMemo(() => getDashboardRoutes(t), [t]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const minimized = useSidebarSizeStore((state) => state.minimized);

  useEffect(() => {
    const currentIndex = routes.findIndex(
      (route: any) =>
        route.path === "/" + activeSegment ||
        (route instanceof Object &&
          "routes" in route &&
          Array.isArray(route.routes) &&
          route.routes.some((subRoute: RouteProps) => subRoute.path === "/" + activeSegment)),
    );
    setActiveIndex(currentIndex);
  }, [currentPath, activeSegment, routes]);

  return (
    <div className="mt-4 relative">
      {!minimized && activeIndex !== null && (
        <motion.span
          className={cn(
            "absolute left-0 bg-sky-600 w-1.5 h-10 rounded-br-xl rounded-tr-xl shadow-sky-700 shadow-md",
            minimized ? "mt-0" : "mt-1.5 mxd:mt-0",
          )}
          layoutId="activeIndicator"
          initial={{ y: 0 }}
          animate={{ y: activeIndex * 48 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <ul className="h-125 w-full overflow-y-auto overflow-x-hidden">
        {routes.map((route, i) => (
          <React.Fragment key={i}>
            {isRouteGroup(route) ? (
              <GroupMenu
                group={route as RouteGroup}
                activeSegment={activeSegment}
                basePath={normalizedBasePath}
                router={router}
              />
            ) : (
              <SingleMenu
                route={route as RouteProps}
                isActive={"/" + activeSegment === route.path}
                basePath={normalizedBasePath}
                router={router}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

function isRouteGroup(route: RouteDefinition): route is RouteGroup {
  return "groupName" in route;
}
