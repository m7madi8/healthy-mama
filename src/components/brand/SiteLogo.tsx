import { Link } from "react-router-dom";
import { site } from "../../data/content.ar";
import { BrandMark } from "./BrandMark";

export type SiteLogoSize = "sm" | "nav" | "footer";

type SiteLogoProps = {
  tone?: "light" | "dark";
  size?: SiteLogoSize;
  showTagline?: boolean;
  /** عند التمرير داخل رابط */
  onClick?: () => void;
  className?: string;
};

const markSize: Record<SiteLogoSize, string> = {
  sm: "h-8 w-8",
  nav: "h-9 w-9 sm:h-10 sm:w-10",
  footer: "h-14 w-14 sm:h-16 sm:w-16",
};

const nameSize: Record<SiteLogoSize, string> = {
  sm: "text-base",
  nav: "text-[1.05rem] sm:text-xl",
  footer: "text-2xl sm:text-3xl",
};

const tagSize: Record<SiteLogoSize, string> = {
  sm: "text-[0.45rem] tracking-[0.18em]",
  nav: "hidden text-[0.5rem] tracking-[0.22em] sm:block",
  footer: "text-[0.55rem] tracking-[0.28em] sm:text-[0.6rem]",
};

export function SiteLogo({
  tone = "light",
  size = "nav",
  showTagline = false,
  onClick,
  className = "",
}: SiteLogoProps) {
  const nameColor = tone === "dark" ? "text-cream" : "text-ink";
  const tagColor = tone === "dark" ? "text-cream/55" : "text-ink/45";

  const inner = (
    <span
      className={`inline-flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <BrandMark
        className={`${markSize[size]} shrink-0`}
        tone={tone}
        title={`${site.brand} — ${site.product}`}
      />
      <span className="flex min-w-0 flex-col justify-center gap-0.5 leading-none">
        <span className={`font-display ${nameSize[size]} ${nameColor} truncate`}>
          {site.brand}
        </span>
        {showTagline ? (
          <span className={`font-semibold uppercase ${tagSize[size]} ${tagColor}`}>
            {site.product}
          </span>
        ) : null}
      </span>
    </span>
  );

  return (
    <Link
      to="/"
      className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      onClick={onClick}
      aria-label={`${site.brand} — الصفحة الرئيسية`}
    >
      {inner}
    </Link>
  );
}

/** للفوتر: شعار كبير بدون رابط مكرر داخل عمود */
export function SiteLogoBlock({
  tone = "dark",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const nameColor = tone === "dark" ? "text-cream" : "text-ink";
  const tagColor = tone === "dark" ? "text-saffron/90" : "text-terracotta";

  return (
    <div className={`relative ${className}`}>
      <p
        className="pointer-events-none absolute -top-2 end-0 font-display text-[clamp(3.5rem,18vw,7rem)] leading-none text-outline text-cream/[0.12] select-none"
        aria-hidden
      >
        {site.brand}
      </p>
      <Link
        to="/"
        className="relative inline-flex transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saffron"
        aria-label={`${site.brand} — الصفحة الرئيسية`}
      >
        <span className="inline-flex items-center gap-3 sm:gap-4">
          <BrandMark
            className="h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]"
            tone={tone}
            title={`${site.brand} — ${site.product}`}
          />
          <span className="flex flex-col gap-1 leading-none">
            <span className={`font-display text-[clamp(1.75rem,6vw,2.75rem)] ${nameColor}`}>
              {site.brand}
            </span>
            <span className={`text-[0.65rem] font-semibold uppercase tracking-[0.32em] sm:text-xs ${tagColor}`}>
              {site.product}
            </span>
            <span className={`mt-1 max-w-[14rem] text-sm font-normal leading-relaxed ${tone === "dark" ? "text-cream/70" : "text-ink/65"}`}>
              {site.tagline}
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}
