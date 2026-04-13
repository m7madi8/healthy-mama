import { Link, type LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-pill px-8 py-3.5 text-[0.95rem] font-semibold tracking-tight transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 active:scale-[0.98] bg-sage-600 text-white shadow-lift hover:bg-sage-500 hover:shadow-[0_16px_48px_rgba(74,107,78,0.25)] hover:-translate-y-0.5";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-pill px-8 py-3.5 text-[0.95rem] font-semibold tracking-tight transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 active:scale-[0.98] border border-sage-200 bg-white/90 text-sage-800 shadow-soft backdrop-blur-sm hover:border-sage-300 hover:bg-white hover:shadow-lift hover:-translate-y-0.5";

type LinkButtonProps = LinkProps & { children: ReactNode; className?: string };

export function LinkButton({ children, className = "", ...props }: LinkButtonProps) {
  return (
    <Link {...props} className={`${btnPrimary} ${className}`.trim()}>
      {children}
    </Link>
  );
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, className = "", variant = "primary", ...props }: NativeButtonProps) {
  const c = variant === "secondary" ? btnSecondary : btnPrimary;
  return (
    <button type="button" {...props} className={`${c} ${className}`}>
      {children}
    </button>
  );
}
