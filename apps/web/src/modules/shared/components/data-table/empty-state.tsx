import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import bgDark from "@/assets/patterns/table-pattern-dark.svg";
import bgLight from "@/assets/patterns/table-pattern-light.svg";
import { Ripple } from "../../ui/ripple";

type DataTableEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  totalRecords?: number;
  children?: ReactNode;
};

export function DataTableEmptyState({ icon: Icon, title, description, children }: DataTableEmptyStateProps) {
  return (
    <div className="relative bg-white dark:bg-background flex w-full flex-col items-center !rounded-xl border bg-center bg-no-repeat shadow-inner">
      <div className="relative flex h-[325px] w-full items-center justify-center bg-background backdrop-blur-xl">
        <Ripple mainCircleSize={140} mainCircleOpacity={0.18} className="w-full h-full" />
        <div className="grid aspect-square size-14 place-items-center rounded-2xl border border-[#CED5E0] dark:border-[#1E293B]">
          <Icon className="size-6" />
        </div>
      </div>
      <div className="mb-9 relative bottom-10 flex flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
