import * as React from "react";
import { cn } from "../utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "horizontal" | "vertical";
  className?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ variant = "horizontal", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[hsl(var(--border))]",
        variant === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Divider.displayName = "Divider";

export { Divider };
