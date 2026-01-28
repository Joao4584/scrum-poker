import React, { useEffect, useState } from "react";
import { RouteProps } from "@/modules/dashboard/routes/dashboard.routes";
import { Skeleton } from "@/modules/shared/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/modules/shared/ui/tooltip";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";

interface SingleMenuProps {
  route: RouteProps;
  isActive: boolean;
  router: any;
  basePath: string;
  className?: string;
}

const SingleMenu: React.FC<SingleMenuProps> = ({ route, isActive, router, basePath, className }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const minimized = useSidebarSizeStore((state) => state.minimized);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <li
      className={`items-center cursor-pointer  text-sm relative dark:hover:bg-slate-500 dark:hover:bg-opacity-20 dark:hover:text-slate-200 ${
        isActive ? "text-black dark:text-slate-200 dark:bg-slate-500 dark:bg-opacity-15" : "dark:text-slate-300"
      } ${className || ""}`}
      onClick={() => router.push(`${basePath}${route.path}`)}
    >
      {showSkeleton ? (
        <div className="flex w-full mt-1 py-3 px-6 gap-3 items-center">
          <Skeleton className="h-6 w-6 rounded-full" />
          {!minimized ? <Skeleton className="h-4 w-24 mxd:hidden" /> : null}
        </div>
      ) : minimized ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex w-full mt-1 py-3 px-5">
              <span className="mr-3 icon-menu-svg">
                <route.icon />
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {route.title}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex w-full mt-1 py-3 px-6">
          <span className="mr-3 icon-menu-svg">
            <route.icon />
          </span>
          <span className="mxd:hidden text-sm">{route.title}</span>
        </div>
      )}
    </li>
  );
};

export default SingleMenu;
