type DirectionHintProps = {
  direction: "back" | "forward";
  className?: string;
};

export function DirectionHint({ direction, className = "" }: DirectionHintProps) {
  const flip = direction === "back" ? "rtl:-scale-x-100" : "-scale-x-100 rtl:scale-x-100";

  return (
    <svg
      viewBox="0 0 16 16"
      className={`inline-block h-3.5 w-3.5 shrink-0 ${flip} ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3 5 8l5 5" />
    </svg>
  );
}
