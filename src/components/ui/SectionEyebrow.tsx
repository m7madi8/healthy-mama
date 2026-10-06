import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
};

export function SectionEyebrow({ children, align = "start", className = "" }: SectionEyebrowProps) {
  const row =
    align === "center"
      ? "justify-center"
      : "justify-start";

  return (
    <p className={`flex items-center gap-2.5 text-xs font-bold text-sage-500 ${row} ${className}`.trim()}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
