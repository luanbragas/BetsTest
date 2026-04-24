import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "ghost" | "outline" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<ButtonVariant, string> = {
    default: "bg-gradient-to-br from-gold-soft to-gold text-ink shadow-glow hover:brightness-110",
    ghost: "border border-white/5 bg-white/[0.045] text-slate-300 backdrop-blur-xl hover:bg-white/[0.07] hover:text-gold-soft",
    outline: "border border-gold/25 bg-transparent text-gold-soft hover:bg-gold/10",
    danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-black uppercase transition disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";
