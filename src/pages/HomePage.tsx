import { AboutSection } from "../components/home/AboutSection";
import { ContactSection } from "../components/home/ContactSection";
import { CtaBand } from "../components/home/CtaBand";
import { Hero } from "../components/home/Hero";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { QuizResultsSection } from "../components/home/QuizResultsSection";
import { QuizSection } from "../components/home/QuizSection";
import { WellnessTipsSection } from "../components/home/WellnessTipsSection";
import { Seo } from "../components/layout/Seo";

export function HomePage() {
  return (
    <>
      <Seo title="نوال عمر | رعاية الحمل والصحة" />
      <Hero />
      <HowItWorksSection />
      <CtaBand
        title="ابدئي رحلتك"
        subtitle="دقيقتان الآن قد توفران عليكِ أسابيع من القلق. إجاباتك تبقى على جهازك حتى تشاركيها إن أردتِ."
        buttonText="ابدئي الاستبيان"
        to="/#quiz-section"
      />
      <AboutSection />
      <WellnessTipsSection />
      <QuizSection />
      <QuizResultsSection />
      <CtaBand
        title="اعثري على كتابك"
        subtitle="كل دليل مكتوب بلهجة دافئة وعملية — لتملكي دائمًا خطوة تالية واضحة."
        buttonText="تصفحي الكتب"
        to="/#quiz-results"
      />
      <ContactSection />
    </>
  );
}
