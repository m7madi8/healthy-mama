import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { BOOKS, type BookId } from "../data/books";
import { QUIZ_CONFIG, type QuizKey } from "../data/quizConfig";
import { getRangeForScore, getTotalScore, isQuizKey } from "../lib/quiz";
import { LinkButton } from "../components/ui/PrimaryButton";

type Phase = "pick" | "run" | "results";

export function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get("type");
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("pick");
  const [quizKey, setQuizKey] = useState<QuizKey | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [resultScore, setResultScore] = useState(0);

  const activeConfig = quizKey ? QUIZ_CONFIG[quizKey] : null;
  const questions = activeConfig?.questions ?? [];

  useEffect(() => {
    if (typeParam && isQuizKey(typeParam)) {
      setQuizKey(typeParam);
      setPhase("run");
      setAnswers([]);
      setCurrentIndex(0);
    } else {
      setQuizKey(null);
      setPhase("pick");
    }
  }, [typeParam]);

  const range = useMemo(() => {
    if (!quizKey || phase !== "results") return null;
    return getRangeForScore(quizKey, resultScore);
  }, [quizKey, phase, resultScore]);

  const bookId = (range?.bookId ?? activeConfig?.bookId) as BookId | undefined;
  const book = bookId ? BOOKS.find((b) => b.id === bookId) : undefined;
  const coverSrc = book?.coverSrc ?? "/1.jpg";

  const selectAnswer = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (answers[currentIndex] == null) return;
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  }, [answers, currentIndex, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const onSubmitQuiz = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!quizKey || answers[currentIndex] == null) return;
      const score = getTotalScore(answers, questions);
      setResultScore(score);
      setPhase("results");
    },
    [quizKey, answers, currentIndex, questions],
  );

  const pickAnother = useCallback(() => {
    navigate("/quiz");
  }, [navigate]);

  useEffect(() => {
    if (phase === "results") {
      document.getElementById("quiz-page-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase]);

  const total = questions.length;
  const pct = total ? ((currentIndex + 1) / total) * 100 : 0;
  const showPrev = currentIndex > 0;
  const showNext = currentIndex < total - 1;
  const showSubmit = currentIndex === total - 1;

  const currentQ = questions[currentIndex];
  const selected = answers[currentIndex] ?? null;

  let messageText = range?.message ?? "";
  if (range && activeConfig && "disclaimer" in activeConfig && activeConfig.disclaimer) {
    messageText = activeConfig.disclaimer + "\n\n" + messageText;
  }
  const stateTitle = range?.stateTitle ?? "";
  const resultCta = range?.cta ?? activeConfig?.cta ?? "احصلي على الكتاب";

  const seoTitle =
    (typeParam && isQuizKey(typeParam) ? QUIZ_CONFIG[typeParam].title : "الاستبيانات") + " | نوال عمر";

  const optTransition = { duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <>
      <Seo title={seoTitle} />
      <main className="min-h-screen bg-milk pb-20 pt-20" id="quiz-page-main">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {phase === "pick" && (
            <div className="pt-4">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
                اختاري الاستبيان
              </h1>
              <p className="mt-3 text-sage-600">الأسئلة بالعربية. اختاري الموضوع الأنسب لحالتك الآن.</p>
              <div className="mt-10 flex flex-col gap-4">
                {(["postnatal", "prep", "pregnancy"] as const).map((key) => {
                  const cfg = QUIZ_CONFIG[key];
                  return (
                    <Link
                      key={key}
                      to={`/quiz?type=${key}`}
                      className="group rounded-3xl border border-sage-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-sage-200 hover:shadow-lift"
                    >
                      <h2 className="font-display text-lg font-semibold text-moss-900 group-hover:text-sage-700">
                        {cfg.title}
                      </h2>
                      <p className="mt-2 text-sm text-sage-600">اضغطي للبدء ←</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "run" && activeConfig && (
            <div className="pt-2" id="quiz-page-run">
              <Link
                to="/#quiz-section"
                className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
              >
                ← تغيير نوع الاستبيان
              </Link>
              <h1 className="mt-6 font-display text-2xl font-semibold leading-snug text-moss-900 sm:text-3xl">
                {activeConfig.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-sage-700">{activeConfig.intro}</p>

              <div className="mt-8 rounded-2xl border border-sage-100 bg-white p-6 shadow-soft sm:p-8">
                <div
                  className="h-2 overflow-hidden rounded-full bg-sage-100"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="تقدم الاستبيان"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600"
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-sage-500">
                  السؤال {currentIndex + 1} من {total}
                </p>

                <form className="mt-8" onSubmit={onSubmitQuiz}>
                  <AnimatePresence mode="wait">
                    {currentQ && (
                      <motion.div
                        key={currentIndex}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={optTransition}
                      >
                        <p className="text-lg font-medium leading-relaxed text-moss-900">{currentQ.text}</p>
                        <div className="mt-6 flex flex-col gap-3">
                          {currentQ.options.map((opt, i) => {
                            const checked = selected === i;
                            return (
                              <label
                                key={i}
                                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all ${
                                  checked
                                    ? "border-sage-500 bg-sage-50 shadow-glow"
                                    : "border-sage-100 bg-milk/50 hover:border-sage-200 hover:bg-white"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`qp${currentIndex}`}
                                  value={i}
                                  checked={checked}
                                  onChange={() => selectAnswer(currentIndex, i)}
                                  className="mt-1 border-sage-300 text-sage-600 focus:ring-sage-500"
                                />
                                <span className="text-sm leading-relaxed text-sage-800">{opt.text}</span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-10 flex flex-wrap gap-3">
                    {showPrev && (
                      <button
                        type="button"
                        onClick={goPrev}
                        className="rounded-pill border border-sage-200 bg-white px-6 py-3 text-sm font-semibold text-sage-800 transition-all hover:border-sage-300 hover:shadow-sm"
                      >
                        السابق
                      </button>
                    )}
                    {showNext && (
                      <button
                        type="button"
                        onClick={goNext}
                        className="rounded-pill bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-sage-500"
                      >
                        التالي
                      </button>
                    )}
                    {showSubmit && (
                      <button
                        type="submit"
                        className="rounded-pill bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-sage-500"
                      >
                        عرض النتيجة
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {phase === "results" && activeConfig && range && bookId && (
            <section className="pt-6" id="quiz-page-results" aria-labelledby="quiz-results-heading">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <h2 id="quiz-results-heading" className="font-display text-2xl font-semibold text-moss-900 sm:text-3xl">
                  نتيجتك
                </h2>
                <div className="mt-4 rounded-2xl border border-sage-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-sage-600">
                    النتيجة: {resultScore} / {activeConfig.maxScore ?? 30}
                  </p>
                  {stateTitle && (
                    <p className="mt-2 text-base font-medium text-moss-900" aria-live="polite">
                      {stateTitle}
                    </p>
                  )}
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-sage-700">{messageText}</p>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                  <LinkButton to={`/books/${bookId}`} className="w-full max-w-sm justify-center sm:w-auto">
                    {resultCta}
                  </LinkButton>
                </div>

                <p className="mt-10 text-center text-sm font-semibold text-sage-600">موصى به لك</p>
                <div className="mx-auto mt-4 flex max-w-md flex-col overflow-hidden rounded-3xl border border-sage-100 bg-white shadow-lift sm:flex-row">
                  <div className="aspect-[10/7] w-full shrink-0 bg-petal sm:w-44 sm:aspect-auto">
                    <img src={coverSrc} alt="" className="h-full w-full object-cover" width={400} height={280} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6 text-start">
                    <h3 className="font-display text-lg font-semibold text-moss-900">
                      {book?.title ?? range.bookTitle}
                    </h3>
                    <p className="mt-1 text-xs text-sage-500">{range.bookTitle || activeConfig.bookTitle}</p>
                    <Link
                      to={`/books/${bookId}`}
                      className="mt-4 inline-flex text-sm font-semibold text-sage-600 hover:text-sage-800"
                    >
                      التفاصيل ←
                    </Link>
                  </div>
                </div>

                <p className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={pickAnother}
                    className="text-sm font-medium text-sage-600 underline-offset-2 hover:text-sage-800 hover:underline"
                  >
                    استبيان آخر
                  </button>
                </p>
              </motion.div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
