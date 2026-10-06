import { testimonials } from "../../data/content.ar";
import { MotionFade } from "../ui/MotionFade";

export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionFade>
          <h2 className="font-display text-3xl font-semibold text-ink">من أمهات مررن من هنا</h2>
        </MotionFade>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={`${t.name}-${t.city}`} className="rounded-2xl border border-grove/20 bg-white p-6 shadow-soft">
              {t.photo ? (
                <img src={t.photo} alt="" className="mb-4 h-14 w-14 rounded-full object-cover" />
              ) : null}
              <blockquote className="text-lg leading-[1.8] text-ink">«{t.quote}»</blockquote>
              <p className="mt-4 text-lg font-semibold text-grove">
                {t.name} — {t.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
