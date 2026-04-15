import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border border-white/10 bg-panel/80 shadow-premium backdrop-blur", className)} {...props} />
));

Card.displayName = "Card";
