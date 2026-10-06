import { quizzes } from "../../data/content.ar";
import { trackEvent } from "../../lib/analytics";
import { SectionInner } from "../editorial/SectionInner";
import { EditorialLinkButton } from "../ui/EditorialButton";

const cardTones = ["bg-saffron", "bg-sage", "bg-peach"] as const;

export function QuizSection() {
  return (
    <section id={quizzes.id} className="relative scroll-mt-24 bg-forest py-14 md:py-20" data-thread-anchor="quizzes">
      <SectionInner>
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-cream">
            {quizzes.title}
          </h2>
          <p className="mt-3 text-lg text-cream/80">{quizzes.intro}</p>
        </div>

        <ul className="mt-10 flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-5">
          {quizzes.items.map((item, i) => (
            <li key={item.key}>
              <article
                className={`flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink shadow-hard ${cardTones[i % cardTones.length]}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-ink bg-cream">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    width={800}
                    height={500}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-sm font-medium text-ink/70">{item.hint}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-ink md:text-[1.65rem]">
                    {item.title}
                  </h3>
                  <div className="mt-5">
                    <EditorialLinkButton
                      to={`/quiz?type=${item.key}`}
                      variant="primary"
                      className="w-full justify-center !text-base"
                      onClick={() => trackEvent("start_quiz", { quiz: item.key })}
                    >
                      ابدئي
                    </EditorialLinkButton>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </SectionInner>
    </section>
  );
}
