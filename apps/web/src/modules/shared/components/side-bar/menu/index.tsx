import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  routeDashboard,
  RouteDefinition,
  RouteProps,
  RouteGroup,
} from "@/modules/dashboard/routes/dashboard.routes";
import { motion } from "framer-motion";
import GroupMenu from "./group-menu";
import SingleMenu from "./single-menu";

interface MenuListProps {
  currentPath: string;
  basePath: string;
}

export default function MenuList({ currentPath, basePath }: MenuListProps) {
  const router = useRouter();
  const normalizedBasePath = useMemo(
    () => (basePath.endsWith("/") ? basePath.slice(0, -1) : basePath),
    [basePath],
  );
  const activeSegment = useMemo(() => {
    const relative = (currentPath.split(`${normalizedBasePath}/`)[1] || "").split("/")[0];
    return relative;
  }, [currentPath, normalizedBasePath]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const currentIndex = routeDashboard.findIndex(
      (route: any) =>
        route.path === "/" + activeSegment ||
        (route instanceof Object &&
          "routes" in route &&
          Array.isArray(route.routes) &&
          route.routes.some((subRoute: RouteProps) => subRoute.path === "/" + activeSegment)),
    );
    setActiveIndex(currentIndex);
  }, [currentPath, activeSegment]);

  return (
    <div className="mt-4 relative">
      {activeIndex !== null && (
        <motion.span
          className="absolute left-0 bg-sky-500 w-1.5 mt-1.5 mxd:mt-0 h-10 mxd:h-10 rounded-br-xl rounded-tr-xl shadow-sky-600 shadow-md"
          layoutId="activeIndicator"
          initial={{ y: 0 }}
          animate={{ y: activeIndex * 48 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <ul className="h-125 w-full overflow-y-auto overflow-x-hidden">
        {routeDashboard.map((route, i) => (
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
