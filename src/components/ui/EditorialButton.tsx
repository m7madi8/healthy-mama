import { Link, type LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[999px] border-2 border-ink px-8 text-lg font-semibold leading-snug transition-transform duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-terracotta";

const variants = {
  primary: "bg-terracotta text-cream shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-hard-press",
  /** بدون حركة hover — أزرار شراء الكتب */
  solid: "bg-terracotta text-cream shadow-hard",
  secondary: "bg-cream text-ink shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-hard-press",
  stamp: "bg-cream text-ink shadow-hard font-hand text-xl rotate-[-4deg]",
};

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function EditorialButton({ children, className = "", variant = "primary", type = "button", ...props }: NativeProps) {
  return (
    <button type={type} {...props} className={`${base} ${variants[variant]} ${className}`.trim()}>
      {children}
    </button>
  );
}

type LinkBtnProps = LinkProps & { children: ReactNode; className?: string; variant?: keyof typeof variants };

export function EditorialLinkButton({ children, className = "", variant = "primary", ...props }: LinkBtnProps) {
  return (
    <Link {...props} className={`${base} ${variants[variant]} ${className}`.trim()}>
      {children}
    </Link>
  );
}
