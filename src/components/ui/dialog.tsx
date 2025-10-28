import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: "sm" | "md" | "lg" | "xl" | "full";
  }
>(({ className, children, size = "lg", ...props }, ref) => {
  const sizeClasses = {
    sm: "max-w-sm mx-4",
    md: "max-w-md mx-4 sm:mx-auto",
    lg: "max-w-lg mx-4 sm:mx-auto",
    xl: "max-w-xl mx-4 sm:mx-auto",
    full: "max-w-full mx-4 sm:mx-6 sm:max-w-4xl"
  };

  const paddingClasses = {
    sm: "p-4 sm:p-5",
    md: "p-4 sm:p-6",
    lg: "p-4 sm:p-6",
    xl: "p-5 sm:p-6 md:p-8",
    full: "p-4 sm:p-6 md:p-8"
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
          sizeClasses[size],
          paddingClasses[size],
          // Mobile-specific adjustments
          "max-h-[90vh] overflow-y-auto",
          "safe-area-top safe-area-bottom",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={cn(
          "absolute right-3 top-3 sm:right-4 sm:top-4 rounded-md sm:rounded-sm opacity-70 ring-offset-background transition-opacity",
          "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          "touch-target p-2 sm:p-1"
        )}>
          <X className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    "flex flex-col space-y-1.5 text-center sm:text-left pb-4 sm:pb-6",
    "border-b border-border/50",
    className
  )} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0 space-y-2",
    "pt-4 sm:pt-6 border-t border-border/50",
    className
  )} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-responsive-lg font-semibold leading-none tracking-tight text-foreground",
      "pr-8 sm:pr-0", // Add padding for close button on mobile
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-responsive-sm text-muted-foreground leading-relaxed", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
