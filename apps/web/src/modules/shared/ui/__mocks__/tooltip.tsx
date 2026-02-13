import type { ReactNode } from "react";

type TooltipProps = {
  children?: ReactNode;
};

type TooltipContentProps = TooltipProps & {
  side?: string;
  sideOffset?: number;
};

export function Tooltip({ children }: TooltipProps) {
  return <div>{children}</div>;
}

export function TooltipTrigger({ children }: TooltipProps & { asChild?: boolean }) {
  return <div>{children}</div>;
}

export function TooltipContent({ children }: TooltipContentProps) {
  return <div data-testid="tooltip-content">{children}</div>;
}
