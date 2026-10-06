import { howItWorks } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";

export function HowItWorksSection() {
  return (
    <section id={howItWorks.id} className="relative scroll-mt-24 bg-peach py-12 md:py-16" data-thread-anchor="how">
      <SectionInner>
        <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[0.95] text-ink">{howItWorks.title}</h2>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map((s) => (
            <li key={s.n} className="rounded-xl border-2 border-ink bg-cream p-5 shadow-hard">
              <p className="font-hand text-2xl text-terracotta">{s.n}</p>
              <h3 className="mt-2 font-display text-xl leading-snug text-ink md:text-2xl">{s.title}</h3>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-base text-ink/75 md:text-lg">{howItWorks.note}</p>
      </SectionInner>
    </section>
  );
}
