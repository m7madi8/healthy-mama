import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { WELLNESS_TIPS, type WellnessTipCategory } from "../../data/wellnessTips";
import { MotionFade } from "../ui/MotionFade";
import { SectionEyebrow } from "../ui/SectionEyebrow";

const ROTATE_MS = 5 * 60 * 1000;

function pickNextIndex(prev: number, len: number): number {
  if (len <= 1) return 0;
  let next = prev;
  let guard = 0;
  while (next === prev && guard < 12) {
    next = Math.floor(Math.random() * len);
    guard += 1;
  }
  return next;
}

function initialIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

const categoryOrder: WellnessTipCategory[] = [
  "الحمل",
  "ما بعد الولادة",
  "التغذية",
  "النوم والراحة",
  "الصحة النفسية",
  "الرضاعة",
  "عام",
];

export function WellnessTipsSection() {
  const reduce = useReducedMotion();
  const len = WELLNESS_TIPS.length;
  const [index, setIndex] = useState(() => initialIndex(len));
  const [cycle, setCycle] = useState(0);

  const advance = useCallback(() => {
    setIndex((prev) => pickNextIndex(prev, len));
    setCycle((c) => c + 1);
  }, [len]);

  useEffect(() => {
    const id = window.setTimeout(advance, ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [advance, cycle]);

  const tip = WELLNESS_TIPS[index];

  return (
    <section id="wellness-tips" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <MotionFade className="lg:col-span-5" variant="gentle-zoom">
            <SectionEyebrow>معلومات مفيدة</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
              نصائح ومقاطع سريعة لرحلتك
            </h2>
            <p className="mt-4 text-sage-600 leading-relaxed">
              كل <span className="font-semibold text-sage-800">٥ دقائق</span> تظهر لكِ نصيحة جديدة من مجالات مختلفة —
              حمل، تغذية، نوم، نفسية، وما بعد الولادة. المحتوى تعليمي وعام؛ استشيري طبيبك أو ممرضتك عند أي أعراض
              مقلقة.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-sage-700">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                تبديل تلقائي كل <span className="font-semibold text-sage-800">٥ دقائق</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                نصائح متنوعة دون تكرار فوري لنفس العنوان
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                يمكنك طلب نصيحة أخرى في أي وقت
              </li>
            </ul>

            <div className="mt-10">
              <SectionEyebrow>مجالات التغطية</SectionEyebrow>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryOrder.map((c) => (
                  <span
                    key={c}
                    className="rounded-pill border border-sage-200/90 bg-white/80 px-3 py-1.5 text-xs font-medium text-sage-700 shadow-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </MotionFade>

          <div className="lg:col-span-7">
            <MotionFade delay={0.08} variant="fade-up">
              <div className="rounded-[2rem] border border-sage-100/90 bg-gradient-to-br from-white via-milk to-mist/60 p-8 shadow-lift ring-1 ring-sage-100/40 sm:p-10">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-sage-500">
                      التحديث التلقائي خلال حوالي ٥ دقائق
                    </p>
                    <button
                      type="button"
                      onClick={advance}
                      className="rounded-pill border border-sage-200 bg-white px-4 py-2 text-xs font-semibold text-sage-700 shadow-sm transition-all hover:border-sage-300 hover:bg-sage-50"
                    >
                      نصيحة أخرى
                    </button>
                  </div>

                  <div
                    className="mt-4 h-1.5 overflow-hidden rounded-full bg-sage-100"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext="خمس دقائق حتى النصيحة التالية"
                    aria-label="الوقت حتى النصيحة التالية"
                  >
                    <div
                      key={cycle}
                      className="wellness-progress-bar h-full w-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600"
                    />
                  </div>

                  <div className="mt-10 min-h-[11rem] sm:min-h-[10rem]">
                    <AnimatePresence mode="wait">
                      <motion.article
                        key={tip.id}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-start"
                        aria-live="polite"
                      >
                        <span className="inline-flex rounded-pill bg-sage-600/10 px-3 py-1 text-xs font-bold text-sage-700">
                          {tip.category}
                        </span>
                        <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-moss-900 sm:text-2xl">
                          {tip.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-sage-700 sm:text-base">{tip.body}</p>
                      </motion.article>
                    </AnimatePresence>
                  </div>

                  <p className="mt-8 border-t border-sage-100/90 pt-6 text-xs leading-relaxed text-sage-500">
                    هذه النصائح للتوعية العامة فقط ولا تشكل استشارة طبية. في حال أعراض مزعجة أو طارئة، راجعي مقدم
                    الرعاية فورًا.
                  </p>
                </div>
              </div>
            </MotionFade>
          </div>
        </div>
      </div>
    </section>
  );
}
