type MotifKind = "star" | "tree" | "dove";

const motifs: Record<MotifKind, string> = {
  star: "M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z",
  tree: "M12 4 L8 12 L10 12 L6 20 L18 20 L14 12 L16 12 L12 4 Z",
  dove: "M4 14 L12 8 L20 14 L16 14 L12 18 L8 14 Z",
};

type StitchMotifProps = {
  kind: MotifKind;
  size?: number;
  className?: string;
};

export function StitchMotif({ kind, size = 48, className = "" }: StitchMotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`text-terracotta ${className}`}
      aria-hidden
    >
      <path d={motifs[kind]} fill="currentColor" opacity={0.85} />
      <text x="6" y="10" className="fill-ink text-[4px] font-bold">×</text>
    </svg>
  );
}
