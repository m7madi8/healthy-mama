import { BooksSection } from "../components/home/BooksSection";
import { FaqSection } from "../components/home/FaqSection";
import { FinalCtaSection } from "../components/home/FinalCtaSection";
import { FloatingWhatsApp } from "../components/home/FloatingWhatsApp";
import { GiftSection } from "../components/home/GiftSection";
import { Hero } from "../components/home/Hero";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { QuizSection } from "../components/home/QuizSection";
import { RelatableSection } from "../components/home/RelatableSection";
import { StorySection } from "../components/home/StorySection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { EditorialShell } from "../components/editorial/EditorialShell";
import { Seo } from "../components/layout/Seo";
import { site } from "../data/content.ar";

const personSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: `${site.brand} | ${site.product}`,
      description: site.seoDescription,
      inLanguage: "ar",
    },
    {
      "@type": "Person",
      name: site.brand,
      jobTitle: "ممرضة ومدربة يوغا",
      description: site.tagline,
    },
  ],
};

export function HomePage() {
  return (
    <EditorialShell>
      <Seo title={site.tabTitle} description={site.seoDescription} image={site.ogImage} jsonLd={personSchema} />
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:m-4 focus:bg-cream focus:p-4 focus:text-ink"
      >
        تخطي إلى المحتوى
      </a>
      <Hero />
      <RelatableSection />
      <StorySection />
      <HowItWorksSection />
      <QuizSection />
      <BooksSection />
      <TestimonialsSection />
      <GiftSection />
      <FaqSection />
      <FinalCtaSection />
      <FloatingWhatsApp />
    </EditorialShell>
  );
}
