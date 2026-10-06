import { shouldReduceMotion } from "../../lib/motionPrefs";

function StitchStar() {
  return (
    <span className="mx-6 inline-flex gap-0.5 align-middle" aria-hidden>
      <span className="text-terracotta">×</span>
      <span className="text-terracotta">×</span>
    </span>
  );
}

type MarqueeProps = {
  text: string;
  className?: string;
  tone?: "cream" | "ink";
};

export function Marquee({ text, className = "", tone = "cream" }: MarqueeProps) {
  const reduced = shouldReduceMotion();
  const parts = text.split("✦").filter(Boolean);
  const segment = parts.map((p, i) => (
    <span key={i}>
      {p.trim()}
      {i < parts.length - 1 ? <StitchStar /> : null}
    </span>
  ));

  const row = (
    <>
      {segment}
      <StitchStar />
      {segment}
    </>
  );

  const color = tone === "cream" ? "text-cream" : "text-ink";

  if (reduced) {
    return (
      <div className={`overflow-hidden border-t-2 border-ink/20 py-4 ${className}`}>
        <p className={`text-center font-display text-[clamp(1.25rem,4vw,2rem)] ${color}`}>{text.replace(/✦/g, " · ")}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden border-t-2 border-ink/20 py-3 ${className}`} aria-hidden>
      <div className="marquee-row font-display text-[clamp(48px,9vw,150px)] leading-[0.95] whitespace-nowrap">
        <div className={`marquee-track-slow inline-flex ${color}`}>{row}</div>
      </div>
      <div className="marquee-row -mt-2 font-display text-[clamp(40px,7vw,120px)] leading-[0.95] whitespace-nowrap opacity-90">
        <div className={`marquee-track-fast inline-flex ${color}`}>{row}</div>
      </div>
    </div>
  );
}
