import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hero, navCopy, privacyLine } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";
import { ArchFrame } from "../ui/ArchFrame";
import { EditorialLinkButton } from "../ui/EditorialButton";
import { shouldReduceMotion } from "../../lib/motionPrefs";

function HeroTitleLine() {
  const parts = hero.h1.split("طبيعي");
  if (parts.length < 2) {
    return <>{hero.h1}</>;
  }
  return (
    <>
      {parts[0]}
      <span className="font-hand text-saffron inline-block rotate-[3deg] text-[1.12em]">طبيعي</span>
      {parts[1]}
    </>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldReduceMotion() || !sectionRef.current) return;
    const lines = sectionRef.current.querySelectorAll("[data-hero-line]");
    gsap.fromTo(
      lines,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.06, ease: "power3.out" },
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden bg-forest text-cream lg:min-h-[min(82svh,800px)]"
      data-thread-anchor="hero"
    >
      <SectionInner className="relative z-10 pb-10 pt-[5.5rem] md:pb-12 md:pt-28">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 xl:gap-10">
          <div className="relative z-20 lg:pe-4">
            <h1 className="font-display text-[clamp(2.5rem,9vw,7.25rem)] leading-[0.92] tracking-normal">
              <span className="block overflow-hidden pb-0.5">
                <span data-hero-line className="block">
                  <HeroTitleLine />
                </span>
              </span>
            </h1>

            <p data-hero-line className="mt-5 max-w-[42ch] text-lg leading-[1.75] text-cream/90">
              {hero.sub}
            </p>

            <div data-hero-line className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <EditorialLinkButton to={hero.ctaHref} className="!min-h-[52px]">
                {navCopy.ctaQuiz}
              </EditorialLinkButton>
              <p className="text-sm text-cream/65">{privacyLine()}</p>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[min(92vw,420px)] lg:max-w-none lg:-ms-8">
            <ArchFrame className="mx-auto w-full" withOffset>
              <div className="relative aspect-[4/5] max-h-[min(48svh,420px)] w-full lg:max-h-[min(52svh,460px)]">
                <img
                  src={hero.imageSrc}
                  alt={hero.imageAlt}
                  className="h-full w-full object-cover object-[center_20%]"
                  width={800}
                  height={1000}
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-[rgba(240,179,58,0.06)]" aria-hidden />
              </div>
            </ArchFrame>
          </div>
        </div>
      </SectionInner>
    </section>
  );
}
