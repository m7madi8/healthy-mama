import { useId, useState } from "react";
import { conversionBooks, faq, faqPrivacyAnswer } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";

const stripColors = ["bg-peach", "bg-mint", "bg-saffron"] as const;

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();
  const strip = stripColors[index % stripColors.length];

  return (
    <div className="border-t-2 border-dashed border-ink/30">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-start font-display text-[clamp(26px,3.2vw,48px)] leading-tight text-ink"
          onClick={() => setOpen((v) => !v)}
        >
          {q}
          <span className="font-hand text-3xl text-terracotta" aria-hidden>{open ? "✓" : "×"}</span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className={`${strip} mx-2 mb-4 border-2 border-ink px-5 py-4 shadow-hard`}>
            <p className="text-lg leading-[1.8] text-ink">{a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const guaranteeText = conversionBooks.items.find((b) => b.guarantee.trim())?.guarantee.trim();
  const items = [
    { q: faq.doctor.q, a: faq.doctor.a },
    { q: faq.privacy.q, a: faqPrivacyAnswer() },
    { q: faq.duration.q, a: faq.duration.a },
    { q: faq.booksFit.q, a: faq.booksFit.a },
    { q: faq.refund.q, a: guaranteeText || faq.refund.aFallback },
    { q: faq.who.q, a: faq.who.a },
  ];

  return (
    <section id={faq.id} className="relative scroll-mt-24 bg-cream py-16 md:py-24">
      <SectionInner>
        <h2 className="font-display text-[clamp(44px,8vw,140px)] leading-[0.95] text-ink">{faq.title}</h2>
        <div className="mt-10">
          {items.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </SectionInner>
    </section>
  );
}
