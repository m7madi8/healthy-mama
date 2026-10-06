import { useState } from "react";
import { relatable, relatableReassurances } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";
import { NoteCard } from "../ui/NoteCard";
import { TornEdge } from "../ui/TornEdge";

const placements = [
  { col: "1 / span 4", row: "1", tone: "paper" as const, rot: -4, w: "max-w-[280px]" },
  { col: "5 / span 4", row: "1", tone: "peach" as const, rot: 3, w: "max-w-[320px]" },
  { col: "9 / span 4", row: "2", tone: "mint" as const, rot: -2, w: "max-w-[260px]" },
  { col: "2 / span 5", row: "3", tone: "saffron" as const, rot: 5, w: "max-w-[340px]" },
  { col: "7 / span 5", row: "3", tone: "cream" as const, rot: -5, w: "max-w-[300px]" },
];

const tonesMobile = ["paper", "peach", "mint", "saffron", "cream"] as const;

export function RelatableSection() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggleFlip = (i: number) => setFlipped((f) => ({ ...f, [i]: !f[i] }));

  return (
    <section id={relatable.id} className="relative scroll-mt-24 bg-saffron py-10 md:py-14" data-thread-anchor="relatable">
      <SectionInner>
        <h2 className="text-end font-display text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] text-ink">
          هل هذا <span className="text-outline">يشبهك</span>؟
        </h2>

        <div className="mt-12 hidden gap-4 md:grid md:grid-cols-12 md:grid-rows-3">
          {relatable.cards.map((text, i) => {
            const p = placements[i] ?? placements[0];
            const back = relatableReassurances[i % relatableReassurances.length];
            const isFlipped = flipped[i];
            return (
              <div
                key={text}
                className={`${p.w} [perspective:800px]`}
                style={{ gridColumn: p.col, gridRow: p.row }}
              >
                <button
                  type="button"
                  className="relative h-full w-full text-start [transform-style:preserve-3d] transition-transform duration-[600ms]"
                  style={{ transform: isFlipped ? "rotateY(180deg)" : undefined }}
                  onClick={() => toggleFlip(i)}
                  aria-pressed={isFlipped}
                  aria-label={`${text} — اضغطي لرؤية الرد`}
                >
                  <div className="[backface-visibility:hidden]">
                    <NoteCard tone={p.tone} rotation={p.rot}>{text}</NoteCard>
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    <NoteCard tone="paper" rotation={-p.rot} className="w-full border-terracotta">
                      {back}
                    </NoteCard>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 md:hidden">
          <p className="mb-4 text-center font-hand text-2xl text-ink/80">اسحبي</p>
          <div className="relative mx-auto h-[220px] max-w-sm">
            {relatable.cards.map((text, i) => {
              const offset = i - mobileIndex;
              if (Math.abs(offset) > 2) return null;
              const back = relatableReassurances[i % relatableReassurances.length];
              const isFlipped = flipped[i];
              return (
                <button
                  key={text}
                  type="button"
                  className="absolute inset-x-4 transition-all duration-300"
                  style={{
                    zIndex: 10 - Math.abs(offset),
                    transform: `translateY(${offset * 8}px) scale(${1 - Math.abs(offset) * 0.05}) rotate(${(i % 2 ? 1 : -1) * 3}deg)`,
                    opacity: offset === 0 ? 1 : 0.6,
                  }}
                  onClick={() => (offset === 0 ? toggleFlip(i) : setMobileIndex(i))}
                >
                  <NoteCard tone={tonesMobile[i % tonesMobile.length]} rotation={i % 2 ? 4 : -3}>
                    {isFlipped && offset === 0 ? back : text}
                  </NoteCard>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {relatable.cards.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-3 w-3 border-2 border-ink ${i === mobileIndex ? "bg-terracotta" : "bg-cream"}`}
                aria-label={`بطاقة ${i + 1}`}
                onClick={() => setMobileIndex(i)}
              />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xl font-medium leading-[1.75] text-ink md:text-2xl">
          {relatable.close}
        </p>
      </SectionInner>
      <TornEdge fill="var(--cream)" />
    </section>
  );
}
