import { useMemo, useState } from "react";
import type { ReaderPageChunk } from "../../lib/firestore";

type BookReaderProps = {
  pages: ReaderPageChunk[];
};

export function BookReader({ pages }: BookReaderProps) {
  const [cursor, setCursor] = useState(0);
  const currentPage = pages[cursor];

  const progress = useMemo(() => {
    if (!pages.length) return 0;
    return Math.round(((cursor + 1) / pages.length) * 100);
  }, [cursor, pages.length]);

  if (!currentPage) {
    return (
      <section className="rounded-3xl border border-sage-100 bg-white p-8 text-center shadow-soft">
        <p className="text-sage-700">لا توجد صفحات متاحة لهذا الكتاب حاليًا.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-sage-100 bg-white/90 px-4 py-3 text-sm text-sage-700 shadow-soft">
        <span>
          صفحة {cursor + 1} من {pages.length}
        </span>
        <span>{progress}%</span>
      </div>
      <article className="min-h-[55vh] rounded-3xl border border-sage-100 bg-white px-6 py-8 leading-loose text-sage-900 shadow-soft sm:px-10">
        {currentPage.heading && <h2 className="mb-6 font-display text-2xl font-semibold">{currentPage.heading}</h2>}
        <p className="whitespace-pre-wrap text-[1.05rem]">{currentPage.content}</p>
      </article>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={cursor <= 0}
          onClick={() => setCursor((prev) => Math.max(prev - 1, 0))}
          className="rounded-pill border border-sage-200 px-5 py-2.5 text-sm font-semibold text-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          الصفحة السابقة
        </button>
        <button
          type="button"
          disabled={cursor >= pages.length - 1}
          onClick={() => setCursor((prev) => Math.min(prev + 1, pages.length - 1))}
          className="rounded-pill bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          الصفحة التالية
        </button>
      </div>
    </section>
  );
}
