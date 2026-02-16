"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      closeButton
      className="toaster group"
      toastOptions={{
        duration: 10022200,
        classNames: {
          toast: "group toast pr-12 group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          icon: "mr-4",
          closeButton:
            "absolute !left-auto !right-2 !top-4 -translate-y-1/2 p-2 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent !shadow-none !border-0 text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-0 [&_svg]:hidden before:content-['×'] before:block before:text-xl before:leading-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
