import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("w-full rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition", className)}
    {...props}
  />
));

Input.displayName = "Input";
