import * as React from "react";

import { cn } from "@/lib/utils";

export type AlertVariant = "default" | "error" | "success" | "info";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const alertVariants: Record<AlertVariant, string> = {
  default:
    "border-border bg-card text-card-foreground",
  error:
    "border-destructive/40 bg-destructive/10 text-destructive-foreground",
  success:
    "border-green-600/40 bg-green-600/10 text-green-700 dark:text-green-300",
  info:
    "border-primary/30 bg-primary/5 text-foreground",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "flex w-full items-start gap-2 rounded-md border px-3 py-2 text-sm",
          alertVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

export { Alert };

