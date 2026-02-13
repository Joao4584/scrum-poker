import * as React from "react";

type WithChildren = { children?: React.ReactNode };

export function DropdownMenuContent({ children }: WithChildren) {
  return <div>{children}</div>;
}

export function DropdownMenuGroup({ children }: WithChildren) {
  return <div>{children}</div>;
}

export function DropdownMenuLabel({ children }: WithChildren) {
  return <div>{children}</div>;
}

export function DropdownMenuSeparator() {
  return <hr />;
}

export function DropdownMenuShortcut({ children }: WithChildren) {
  return <span>{children}</span>;
}

export function DropdownMenuItem({
  children,
  onClick,
}: WithChildren & { onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}
