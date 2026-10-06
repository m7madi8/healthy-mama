import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookCover } from "../components/book/BookCover";
import { Seo } from "../components/layout/Seo";
import { EpdsCrisisScreen } from "../components/quiz/EpdsCrisisScreen";
import { BOOKS, type BookId } from "../data/books";
import { epdsCopy, supportLinesByCountry } from "../data/content.ar";
import { QUIZ_CONFIG, type QuizKey } from "../data/quizConfig";
import { trackEvent } from "../lib/analytics";
import { getRangeForScore, getTotalScore, isQuizKey } from "../lib/quiz";
import { LinkButton } from "../components/ui/PrimaryButton";
import { DirectionHint } from "../components/ui/DirectionHint";

type Phase = "pick" | "run" | "results" | "crisis";

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

  const selectAnswer = useCallback(
    (qIndex: number, optionIndex: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[qIndex] = optionIndex;
        return next;
      });
      if (quizKey === "postnatal" && qIndex === 9) {
        const value = questions[qIndex]?.options[optionIndex]?.value;
        if (typeof value === "number" && value > 0) {
          setPhase("crisis");
          trackEvent("complete_quiz", { quiz: "postnatal", band: "crisis" });
        }
      }
    },
    [quizKey, questions],
  );

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
      const band = getRangeForScore(quizKey, score).key;
      trackEvent("complete_quiz", { quiz: quizKey, band });
    },
    [quizKey, answers, currentIndex, questions],
  );

  const pickAnother = useCallback(() => {
    navigate("/quiz");
  }, [navigate]);

  useEffect(() => {
    if (phase === "results" || phase === "crisis") {
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
      <main className="min-h-screen bg-cream pb-20 pt-20" id="quiz-page-main">
        {phase === "run" && activeConfig ? (
          <div
            className="fixed start-0 end-0 top-16 z-50 h-1 bg-mint"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="تقدم الاستبيان"
          >
            <div className="h-full bg-terracotta transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        ) : null}
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
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sage-600">
                        اضغطي للبدء
                        <DirectionHint direction="forward" />
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "run" && activeConfig && (
            <div className="pt-2" id="quiz-page-run">
              <Link
                to="/#quizzes"
                className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
              >
                <span className="inline-flex items-center gap-1.5">
                  <DirectionHint direction="back" />
                  تغيير نوع الاستبيان
                </span>
              </Link>
              <h1 className="mt-6 font-display text-[clamp(36px,5vw,56px)] leading-snug text-ink">
                {activeConfig.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-ink/75">{activeConfig.intro}</p>

              <div className="mt-8">
                <p className="text-sm text-ink/60">{`السؤال ${currentIndex + 1} من ${total}`}</p>

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
                        <p className="font-display text-2xl font-normal leading-relaxed text-ink md:text-3xl">{currentQ.text}</p>
                        <div className="mt-8 flex flex-col gap-3">
                          {currentQ.options.map((opt, i) => {
                            const checked = selected === i;
                            return (
                              <label
                                key={i}
                                className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-[999px] border-2 border-ink px-5 py-4 transition-all ${
                                  checked ? "bg-sage shadow-hard" : "bg-paper hover:translate-x-0.5 hover:translate-y-0.5"
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
                                <span className="text-lg leading-relaxed text-ink">{opt.text}</span>
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

          {phase === "crisis" && (
            <div id="quiz-page-results">
              <EpdsCrisisScreen />
            </div>
          )}

          {phase === "results" && activeConfig && range && bookId && (
            <section className="pt-6" id="quiz-page-results" aria-labelledby="quiz-results-heading">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                {quizKey === "postnatal" && range.key === "high" ? (
                  <>
                    <h2 id="quiz-results-heading" className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                      {epdsCopy.highTitle}
                    </h2>
                    <p className="mt-4 text-lg leading-[1.8] text-ink" aria-live="polite">
                      {epdsCopy.highBody}
                    </p>
                    {supportLinesByCountry.length > 0 ? (
                      <ul className="mt-6 space-y-2 rounded-2xl border border-grove/30 bg-cream p-5">
                        {supportLinesByCountry.map((line) => (
                          <li key={`${line.country}-${line.phone}`} className="text-lg text-ink">
                            {line.country} — {line.label}: {line.phone}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-10 text-lg font-semibold text-ink">{epdsCopy.highBookLabel}</p>
                    <div className="mx-auto mt-4 flex max-w-md flex-col overflow-hidden rounded-2xl border border-grove/20 bg-white sm:flex-row">
                      {book ? <BookCover book={book} size="fill" className="min-h-[10rem] sm:min-h-full sm:w-44 sm:min-w-44" /> : null}
                      <div className="flex flex-1 flex-col justify-center p-6 text-start">
                        <h3 className="font-display text-lg font-semibold text-ink">{book?.title ?? range.bookTitle}</h3>
                        <Link to={`/books/${bookId}`} className="mt-4 inline-flex text-lg font-semibold text-grove">
                          <span className="inline-flex items-center gap-1.5">
                            اكتشفي الدليل
                            <DirectionHint direction="forward" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : quizKey === "postnatal" && (range.key === "medium" || range.key === "low") ? (
                  <>
                    <h2 id="quiz-results-heading" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {range.key === "medium" ? epdsCopy.mediumTitle : epdsCopy.lowTitle}
                    </h2>
                    <p className="mt-4 text-lg leading-[1.8] text-ink">
                      {range.key === "medium" ? epdsCopy.mediumBody : epdsCopy.lowBody}
                    </p>
                    <div className="mt-8">
                      <LinkButton to={`/books/${bookId}`}>
                        {range.key === "medium" ? epdsCopy.complementCta : epdsCopy.companionCta}
                      </LinkButton>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 id="quiz-results-heading" className="font-display text-2xl font-semibold text-moss-900 sm:text-3xl">
                      نتيجتك
                    </h2>
                    <div className="mt-4 rounded-2xl border border-sage-100 bg-white p-6 shadow-soft">
                      <p className="text-lg font-semibold text-sage-600">
                        النتيجة: {resultScore} / {activeConfig.maxScore ?? 30}
                      </p>
                      {stateTitle && (
                        <p className="mt-2 text-lg font-medium text-moss-900" aria-live="polite">
                          {stateTitle}
                        </p>
                      )}
                      <p className="mt-4 whitespace-pre-line text-lg leading-[1.8] text-sage-700">{messageText}</p>
                    </div>
                    <div className="mt-8 flex flex-col items-center gap-4 text-center">
                      <LinkButton to={`/books/${bookId}`} className="w-full max-w-sm justify-center sm:w-auto">
                        {resultCta}
                      </LinkButton>
                    </div>
                    <p className="mt-10 text-center text-lg font-semibold text-sage-600">موصى به لك</p>
                    <div className="mx-auto mt-4 flex max-w-md flex-col overflow-hidden rounded-3xl border border-sage-100 bg-white shadow-lift sm:flex-row">
                      {book ? (
                        <BookCover book={book} size="fill" className="min-h-[10rem] sm:min-h-full sm:w-44 sm:min-w-44" />
                      ) : null}
                      <div className="flex flex-1 flex-col justify-center p-6 text-start">
                        <h3 className="font-display text-lg font-semibold text-moss-900">
                          {book?.title ?? range.bookTitle}
                        </h3>
                        <Link to={`/books/${bookId}`} className="mt-4 inline-flex text-lg font-semibold text-sage-600">
                          <span className="inline-flex items-center gap-1.5">
                            اكتشفي الدليل
                            <DirectionHint direction="forward" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                <p className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={pickAnother}
                    className="min-h-12 text-lg font-medium text-sage-600 underline-offset-2 hover:underline"
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
