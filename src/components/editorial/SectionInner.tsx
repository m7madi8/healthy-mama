import type { ReactNode } from "react";

type SectionInnerProps = {
  children: ReactNode;
  className?: string;
};

export function SectionInner({ children, className = "" }: SectionInnerProps) {
  return (
    <div className={`section-inner mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,80px)] ${className}`.trim()}>
      {children}
    </div>
  );
}
