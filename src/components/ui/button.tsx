import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#042558] text-white hover:bg-[#042558]/90 hover:shadow-lg active:bg-[#042558]/95 focus:ring-[#042558]/50 shadow-sm",
        primary: "bg-[#042558] text-white hover:bg-[#042558]/90 hover:shadow-lg active:bg-[#042558]/95 focus:ring-[#042558]/50 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-600/90 hover:shadow-lg active:bg-red-600/95 focus:ring-red-500/50 shadow-sm",
        outline: "border-2 border-[#042558] text-[#042558] hover:bg-[#042558] hover:text-white hover:shadow-md active:bg-[#042558]/95 focus:ring-[#042558]/50 bg-white",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200/80 hover:shadow-md active:bg-gray-200 focus:ring-gray-500/50 border border-gray-200",
        ghost: "text-gray-700 hover:bg-gray-100/80 hover:shadow-sm active:bg-gray-100 focus:ring-gray-500/50",
        success: "bg-green-600 text-white hover:bg-green-600/90 hover:shadow-lg active:bg-green-600/95 focus:ring-green-500/50 shadow-sm",
        info: "bg-blue-600 text-white hover:bg-blue-600/90 hover:shadow-lg active:bg-blue-600/95 focus:ring-blue-500/50 shadow-sm",
        warning: "bg-yellow-500 text-white hover:bg-yellow-500/90 hover:shadow-lg active:bg-yellow-500/95 focus:ring-yellow-500/50 shadow-sm",
        danger: "bg-red-600 text-white hover:bg-red-600/90 hover:shadow-lg active:bg-red-600/95 focus:ring-red-500/50 shadow-sm",
        verified: "bg-green-100 text-green-700 hover:bg-green-200/80 hover:shadow-md active:bg-green-200 focus:ring-green-500/50 border border-green-200",
        waiting: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200/80 hover:shadow-md active:bg-yellow-200 focus:ring-yellow-500/50 border border-yellow-200",
        suspended: "bg-red-100 text-red-700 hover:bg-red-200/80 hover:shadow-md active:bg-red-200 focus:ring-red-500/50 border border-red-200",
        "in-progress": "bg-blue-100 text-blue-700 hover:bg-blue-200/80 hover:shadow-md active:bg-blue-200 focus:ring-blue-500/50 border border-blue-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 focus:text-primary/80 focus:underline px-0 h-auto",
        subtle: "text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:bg-muted/50 focus:text-foreground",
        dashed: "border-2 border-dashed border-[#042558] text-[#042558] hover:bg-[#042558] hover:text-white hover:border-solid hover:shadow-md focus:ring-[#042558]/50 bg-white",
      },
      size: {
        xs: "h-8 px-4 py-1.5 text-xs rounded-lg min-h-[32px]",
        sm: "h-9 px-4 py-1.5 text-sm rounded-lg min-h-[36px]",
        default: "h-10 px-6 py-2.5 text-sm rounded-lg min-h-[40px]",
        md: "h-10 px-6 py-2.5 text-sm rounded-lg min-h-[40px]",
        lg: "h-12 px-8 py-3 text-base rounded-lg min-h-[48px]",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px] rounded-lg",
        "icon-sm": "h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg",
        "icon-lg": "h-12 w-12 min-h-[48px] min-w-[48px] rounded-lg",
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
