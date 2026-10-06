import type { ReactNode } from "react";

type ArchFrameProps = {
  children: ReactNode;
  className?: string;
  withOffset?: boolean;
  border?: boolean;
};

export function ArchFrame({ children, className = "", withOffset = true, border = true }: ArchFrameProps) {
  return (
    <div className={`relative ${className}`.trim()}>
      {withOffset ? (
        <div
          className="pointer-events-none absolute inset-0 -z-10 translate-x-4 translate-y-4 rotate-[4deg] rounded-[999px_999px_0_0] bg-peach"
          aria-hidden
        />
      ) : null}
      <div
        className={`relative overflow-hidden rounded-[999px_999px_0_0] ${border ? "border-[3px] border-ink" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
