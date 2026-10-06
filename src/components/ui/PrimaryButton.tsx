import type { ReactNode } from "react";
import { EditorialButton, EditorialLinkButton } from "./EditorialButton";
import type { LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes } from "react";

export const btnPrimary =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[999px] border-2 border-ink bg-terracotta px-8 text-lg font-semibold text-cream shadow-hard";

export const btnSecondary =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[999px] border-2 border-ink bg-cream px-8 text-lg font-semibold text-ink shadow-hard";

type LinkButtonProps = LinkProps & { children: ReactNode; className?: string };

export function LinkButton({ children, className = "", ...props }: LinkButtonProps) {
  return (
    <EditorialLinkButton {...props} className={className}>
      {children}
    </EditorialLinkButton>
  );
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, className = "", variant = "primary", ...props }: NativeButtonProps) {
  return (
    <EditorialButton {...props} variant={variant === "secondary" ? "secondary" : "primary"} className={className}>
      {children}
    </EditorialButton>
  );
}
