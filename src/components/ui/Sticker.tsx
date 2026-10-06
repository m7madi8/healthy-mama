import { Link } from "react-router-dom";
import { shouldReduceMotion } from "../../lib/motionPrefs";

type StickerProps = {
  label: string;
  href: string;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export function Sticker({ label, href, size = 180, className = "", onClick }: StickerProps) {
  const id = `sticker-path-${size}`;
  const reduced = shouldReduceMotion();
  const r = size / 2 - 8;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group relative inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-cream text-ink shadow-hard transition-transform hover:scale-[1.08] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-terracotta ${className}`}
      style={{ width: size, height: size }}
      aria-label={label.replace(/✦/g, " ")}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <path
            id={id}
            d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
            fill="none"
          />
        </defs>
        <text
          className={`fill-ink font-sans text-[11px] font-medium ${reduced ? "" : "animate-sticker-spin group-hover:[animation-play-state:paused]"}`}
          style={{ fontSize: size * 0.062 }}
        >
          <textPath href={`#${id}`} startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>
      <span className="relative z-10 font-display text-lg text-terracotta">✦</span>
    </Link>
  );
}
