import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BookTocEntry } from "../../data/book-postnatal-toc";
import { getChapterForPage, getPageShortHeading } from "../../data/book-postnatal-toc";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ReaderPageChunk } from "../../lib/firestore";
import { BookPageContent } from "./BookPageContent";
import { BookToc } from "./BookToc";

const TOC_HEADINGS = new Set(["فهرس الدليل", "الفهرس"]);

type BookReaderProps = {
  pages: ReaderPageChunk[];
  toc?: BookTocEntry[];
  bookId?: string;
};

export function BookReader({ pages, toc, bookId = "book-postnatal" }: BookReaderProps) {
  const [cursor, setCursor] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const currentPage = pages[cursor];

  const goToPage = useCallback((index: number) => {
    setCursor(Math.max(0, Math.min(index, pages.length - 1)));
  }, [pages.length]);

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [cursor, reduceMotion]);

  const progress = useMemo(() => {
    if (!pages.length) return 0;
    return Math.round(((cursor + 1) / pages.length) * 100);
  }, [cursor, pages.length]);

  const isTocPage = currentPage?.heading != null && TOC_HEADINGS.has(currentPage.heading);
  const isCoverPage = cursor === 0;
  const isDisclaimerPage = cursor === 1;
  const chapter = getChapterForPage(cursor);
  const displayHeading =
    bookId === "book-postnatal"
      ? getPageShortHeading(cursor) ?? currentPage?.heading
      : currentPage?.heading;

  if (!currentPage) {
    return (
      <section className="rounded-3xl border border-sage-100 bg-white p-8 text-center shadow-soft">
        <p className="text-sage-700">لا توجد صفحات متاحة لهذا الكتاب حاليًا.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div ref={topRef} className="scroll-mt-24" aria-hidden />
      <div className="overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft">
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-sage-700">
          <span className="font-medium tabular-nums">
            {cursor + 1} / {pages.length}
          </span>
          {chapter ? (
            <span className="rounded-pill bg-sage-100 px-3 py-0.5 text-xs font-bold text-sage-700">
              الفصل {chapter.chapter}
            </span>
          ) : null}
          <span className="tabular-nums text-sage-500">{progress}%</span>
        </div>
        <div className="h-1.5 bg-sage-100">
          <div
            className="h-full rounded-e-full bg-gradient-to-l from-sage-500 to-sage-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <article
        className={
          "relative overflow-hidden rounded-[1.75rem] border border-sage-100/90 shadow-soft " +
          (isCoverPage
            ? "bg-gradient-to-b from-petal via-white to-sage-50/40 px-8 py-12 text-center sm:px-12 sm:py-16"
            : isDisclaimerPage
              ? "border-amber-200/60 bg-gradient-to-b from-amber-50/40 via-white to-petal/50 px-5 py-8 sm:px-10 sm:py-10"
              : "bg-gradient-to-b from-white via-white to-mist/30 px-5 py-8 sm:px-10 sm:py-10")
        }
      >
        {!isCoverPage && (
          <div
            className="pointer-events-none absolute -start-16 -top-16 h-40 w-40 rounded-full bg-sage-200/25 blur-3xl"
            aria-hidden
          />
        )}

        {isCoverPage ? (
          <div className="relative space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-500">دليل إلكتروني توعوي</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-moss-900 sm:text-4xl">
              الاكتئاب بعد الولادة
            </h2>
            <p className="mx-auto max-w-md text-lg leading-relaxed text-sage-700">
              دليل الأم لفهم مشاعرها واستعادة توازنها
            </p>
            <div className="mx-auto mt-6 max-w-sm space-y-1 border-t border-sage-100 pt-6 text-sm text-sage-600">
              {currentPage.content.split("\n").slice(3).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <>
            {displayHeading && !isTocPage && (
              <header className="relative mb-8 border-b border-sage-100/80 pb-5">
                {chapter ? (
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-sage-500">
                    الفصل {chapter.chapter}
                  </p>
                ) : null}
                <h2 className="font-display text-2xl font-semibold leading-snug text-moss-900 sm:text-[1.65rem]">
                  {displayHeading}
                </h2>
              </header>
            )}
            {isTocPage && toc?.length ? (
              <>
                <h2 className="mb-6 font-display text-2xl font-semibold text-moss-900">الفهرس</h2>
                <BookToc entries={toc} totalPages={pages.length} onSelect={goToPage} />
              </>
            ) : (
              <BookPageContent content={currentPage.content} />
            )}
          </>
        )}
      </article>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {toc?.length ? (
          <button
            type="button"
            onClick={() => {
              const tocIdx = pages.findIndex((p) => p.heading != null && TOC_HEADINGS.has(p.heading));
              if (tocIdx >= 0) goToPage(tocIdx);
            }}
            className="rounded-pill border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-700 shadow-sm transition-colors hover:border-sage-300 hover:bg-sage-50"
          >
            الفهرس
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            disabled={cursor <= 0}
            onClick={() => goToPage(cursor - 1)}
            className="rounded-pill border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-700 shadow-sm transition-colors hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            السابق
          </button>
          <button
            type="button"
            disabled={cursor >= pages.length - 1}
            onClick={() => goToPage(cursor + 1)}
            className="rounded-pill bg-sage-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-sage-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            التالية
          </button>
        </div>
      </div>
    </section>
  );
}
