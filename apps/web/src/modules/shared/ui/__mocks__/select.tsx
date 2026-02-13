import * as React from "react";

type SelectRootProps = {
  value?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
};

export function Select({ value, onValueChange, disabled, children }: SelectRootProps) {
  return (
    <div data-testid="select-root" data-value={value} data-disabled={disabled ? "true" : "false"}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { value, onValueChange, disabled }) : child,
      )}
    </div>
  );
}

export function SelectTrigger({ children }: { children?: React.ReactNode }) {
  return <button type="button">{children}</button>;
}

export function SelectContent({
  children,
  onValueChange,
}: {
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { onValueChange }) : child,
      )}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  onValueChange,
}: {
  value: string;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
}) {
  return (
    <button type="button" onClick={() => onValueChange?.(value)}>
      {children}
    </button>
  );
}
