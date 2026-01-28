import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronsDown, ChevronsRight } from "lucide-react";
import { RouteGroup } from "@/modules/dashboard/routes/dashboard.routes";
import SingleMenu from "./single-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/modules/shared/ui/tooltip";
import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";

interface GroupMenuProps {
  group: RouteGroup;
  activeSegment: string;
  basePath: string;
  router: any;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ group, activeSegment, basePath, router }) => {
  const [isOpen, setIsOpen] = useState(false);
  const minimized = useSidebarSizeStore((state) => state.minimized);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <li
        className={`items-center cursor-pointer rounded-sm text-sm relative dark:hover:bg-slate-500 dark:hover:bg-opacity-20 dark:hover:text-slate-200`}
        onClick={toggleOpen}
      >
        <motion.div whileTap={{ scale: 0.95 }}>
          <div className="flex w-full mt-1 py-3 px-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="mr-3 icon-menu-svg">
                  <group.icon />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {group.groupName}
              </TooltipContent>
            </Tooltip>
            {!minimized ? <span className="flex-1 mxd:hidden">{group.groupName}</span> : null}
            {!minimized ? <span className="ml-3 mxd:hidden mt-0.5 icon-menu-svg">{isOpen ? <ChevronsDown /> : <ChevronsRight />}</span> : null}
          </div>
        </motion.div>
      </li>
      {isOpen &&
        group.routes &&
        group.routes.map((route, index) => (
          <SingleMenu key={index} route={route} className="pl-3" isActive={"/" + activeSegment === route.path} router={router} basePath={basePath} />
        ))}
    </React.Fragment>
  );
};

export default GroupMenu;
