/**
 * Default profile silhouette when no photo — matches site sage palette (flat icon style).
 */
export function ProfileAvatarPlaceholder({
  className = "",
  "aria-label": ariaLabel = "لا توجد صورة شخصية",
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center text-sage-500 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-[3.25rem] w-[3.25rem] shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="50" cy="34" r="20" />
        <path d="M 22 56 Q 50 48 78 56 L 86 90 Q 50 98 14 90 Z" />
      </svg>
    </span>
  );
}
