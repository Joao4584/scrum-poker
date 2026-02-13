import type { HTMLAttributes } from "react";

export function Skeleton({ className }: HTMLAttributes<HTMLDivElement>) {
  return <div data-testid="skeleton" className={className} />;
}
