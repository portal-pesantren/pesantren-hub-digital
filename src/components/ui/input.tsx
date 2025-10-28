import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex w-full rounded-md border border-input bg-background px-3 py-2",
          // Typography
          "text-responsive-sm",
          // Focus states
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled states
          "disabled:cursor-not-allowed disabled:opacity-50",
          // File input styles
          "file:border-0 file:bg-transparent file:text-responsive-xs file:font-medium file:text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Default height with responsive override
          "h-10 sm:h-11",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
