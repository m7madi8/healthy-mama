import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { QUIZ_CONFIG, type QuizKey } from "../../data/quizConfig";
import { MotionFade } from "../ui/MotionFade";
import { MotionStagger, MotionStaggerItem } from "../ui/MotionStagger";

const cards: { key: QuizKey; hint: string }[] = [
  {
    key: "postnatal",
    hint: "مقياس إدنبرة — لتقييم المزاج بعد الولادة",
  },
  {
    key: "prep",
    hint: "٢٠ سؤالًا عن الاستعداد الجسدي والنمط اليومي",
  },
  {
    key: "pregnancy",
    hint: "٢٠ سؤالًا عن أعراض الحمل والعناية اليومية",
  },
];

export function QuizSection() {
  const reduce = useReducedMotion();
  return (
    <section id="quiz-section" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionFade variant="gentle-zoom">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-sage-500">الاستبيانات</p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
            اختاري الموضوع الذي يهمّك الآن
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sage-600">
            أسئلة بالعربية، ونتيجة واضحة مع توصية بكتاب يناسب إجاباتك.
          </p>
        </MotionFade>

        <MotionStagger className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.1} delayChildren={0.05}>
          {cards.map((c) => {
            const cfg = QUIZ_CONFIG[c.key];
            return (
              <MotionStaggerItem key={c.key}>
                <motion.div
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    to={`/quiz?type=${c.key}`}
                    className="group flex h-full flex-col rounded-3xl border border-sage-100 bg-white p-8 shadow-soft transition-all duration-300 hover:border-sage-200 hover:shadow-lift"
                  >
                    <span className="text-xs font-bold tracking-wide text-sage-500">{c.hint}</span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-moss-900 group-hover:text-sage-700">
                      {cfg.title}
                    </h3>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sage-600 transition-all group-hover:gap-3 group-hover:text-sage-800">
                      ابدئي الاستبيان
                      <span aria-hidden>←</span>
                    </span>
                  </Link>
                </motion.div>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}
