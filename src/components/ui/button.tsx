import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
      },
      size: {
        xs: "h-8 px-3 py-1.5 text-xs rounded-md min-h-[32px]",
        sm: "h-9 px-3 py-2 text-sm rounded-md min-h-[36px]",
        default: "h-10 px-4 py-2 text-sm rounded-md min-h-[40px]",
        lg: "h-11 px-6 py-2.5 text-base rounded-md min-h-[44px]",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
        "icon-sm": "h-8 w-8 min-h-[32px] min-w-[32px]",
        "icon-lg": "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
