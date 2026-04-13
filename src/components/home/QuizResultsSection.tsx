import { motion, useReducedMotion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { QUIZ_CONFIG } from "../../data/quizConfig";
import { BOOKS, type BookId } from "../../data/books";
import { getRangeForScore, isQuizKey } from "../../lib/quiz";
import { MotionFade } from "../ui/MotionFade";
import { MotionStagger, MotionStaggerItem } from "../ui/MotionStagger";
import { scrollEase, scrollViewport } from "../ui/motionPresets";

export function QuizResultsSection() {
  const [searchParams] = useSearchParams();
  const quiz = searchParams.get("quiz");
  const scoreStr = searchParams.get("score");
  const score = scoreStr !== null ? parseInt(scoreStr, 10) : NaN;
  const reduce = useReducedMotion();

  const hasResult = Boolean(quiz && isQuizKey(quiz) && !Number.isNaN(score));

  let messageText = "اختاري استبيانًا أعلاه وأكمليه لعرض ملخصك والكتاب الموصى به.";
  let ctaText = "احصلي على الكتاب";
  let bookId: BookId | undefined;
  let ctaHref = "#quiz-section";

  if (hasResult && quiz && isQuizKey(quiz)) {
    const config = QUIZ_CONFIG[quiz];
    const range = getRangeForScore(quiz, score);
    messageText = range.message;
    if ("disclaimer" in config && config.disclaimer) {
      messageText = config.disclaimer + "\n\n" + messageText;
    }
    bookId = (range.bookId || config.bookId) as BookId;
    ctaText = range.cta || config.cta;
    ctaHref = `/books/${bookId}`;
  }

  return (
    <section id="quiz-results" className="scroll-mt-24 border-t border-sage-100/80 bg-mist/40 py-20 backdrop-blur-[1px] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionFade variant="fade-down">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-sage-500">النتيجة والتوصية</p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
            كتب موصى بها لك
          </h2>
        </MotionFade>

        <MotionFade delay={0.06} variant="gentle-zoom">
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-sage-100 bg-white/90 p-6 text-center shadow-soft backdrop-blur-sm">
            <p className="whitespace-pre-line text-sm leading-relaxed text-sage-700">{messageText}</p>
            {hasResult && (
              <motion.div
                className="mt-6"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ duration: 0.45, ease: scrollEase }}
              >
                <Link
                  to={ctaHref}
                  className="inline-flex rounded-pill bg-sage-600 px-8 py-3 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-sage-500"
                >
                  {ctaText}
                </Link>
              </motion.div>
            )}
          </div>
        </MotionFade>

        <MotionFade className="mt-16" variant="fade-up">
          <h3 className="text-center font-display text-xl font-semibold text-moss-900">جميع الأدلة</h3>
        </MotionFade>

        <MotionStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08} delayChildren={0.04}>
          {BOOKS.map((book) => (
            <MotionStaggerItem key={book.id}>
              <motion.article
                className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                  hasResult && bookId === book.id
                    ? "border-sage-400 ring-2 ring-sage-300/60"
                    : "border-sage-100 hover:border-sage-200"
                }`}
                whileHover={reduce ? undefined : { scale: 1.01 }}
              >
                <div className="aspect-[10/7] overflow-hidden bg-petal">
                  <img src={book.coverSrc} alt="" className="h-full w-full object-cover" width={400} height={280} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="font-display text-base font-semibold leading-snug text-moss-900">{book.title}</h4>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-sage-600">{book.cardDescription}</p>
                  <Link
                    to={`/books/${book.slug}`}
                    className="mt-4 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
                  >
                    عرض الكتاب ←
                  </Link>
                </div>
              </motion.article>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
