type BrandMarkProps = {
  className?: string;
  tone?: "light" | "dark";
  title?: string;
};

/**
 * حضن بسيط: رأس الأم · قوس الذراعين · الطفل.
 * ثلاثة أشكال فقط — واضح من 20px.
 */
export function BrandMark({ className = "", tone = "light", title }: BrandMarkProps) {
  const figure = tone === "dark" ? "var(--cream)" : "var(--forest)";
  const plate = tone === "dark" ? "color-mix(in srgb, var(--forest-2) 92%, var(--forest))" : "color-mix(in srgb, var(--mint) 45%, var(--cream))";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="32" cy="32" r="28" fill={plate} />
      <path
        d="M 14 33c0 14 8 22 18 22s18-8 18-22"
        stroke={figure}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="18" r="7" fill={figure} />
      <circle cx="32" cy="39" r="6.5" fill="var(--terracotta)" />
      <circle cx="33.5" cy="37.5" r="1.25" fill="color-mix(in srgb, var(--peach) 80%, white)" opacity="0.85" />
    </svg>
  );
}
