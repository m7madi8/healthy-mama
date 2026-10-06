import { story } from "../../data/content.ar";
import { SectionInner } from "../editorial/SectionInner";

export function StorySection() {
  const hasStory = story.body.trim().length > 0;

  return (
    <section id={story.id} className="relative scroll-mt-24 bg-cream py-12 md:py-16" data-thread-anchor="story">
      <SectionInner className="max-w-3xl">
        <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[0.95] text-ink">{story.eyebrow}</h2>
        {hasStory ? (
          <p className="mt-6 whitespace-pre-line text-lg leading-[1.8] text-ink">{story.body}</p>
        ) : (
          <p className="mt-4 text-lg leading-[1.8] text-ink/90">{story.credentials}</p>
        )}
      </SectionInner>
    </section>
  );
}
