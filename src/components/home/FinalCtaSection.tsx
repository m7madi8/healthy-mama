import { finalCta } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";
import { EditorialLinkButton } from "../ui/EditorialButton";

export function FinalCtaSection() {
  return (
    <section id={finalCta.id} className="scroll-mt-24 bg-forest py-16 md:py-20">
      <SectionInner className="max-w-3xl text-center">
        <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] text-cream">
          {finalCta.title}
        </h2>
        <p className="mt-4 text-lg text-cream/85">{finalCta.close}</p>
        <div className="mt-8 flex justify-center">
          <EditorialLinkButton to={finalCta.href}>{finalCta.button}</EditorialLinkButton>
        </div>
      </SectionInner>
    </section>
  );
}
