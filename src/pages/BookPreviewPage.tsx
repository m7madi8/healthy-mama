import { Link, Navigate, useParams } from "react-router-dom";
import { BookReader } from "../components/reader/BookReader";
import { Seo } from "../components/layout/Seo";
import { getBookById, isBookId } from "../data/books";
import { BOOK_POSTNATAL_DRAFT_PAGES } from "../data/book-postnatal-draft";
import { getBookToc } from "../data/book-postnatal-toc";
import type { ReaderPageChunk } from "../lib/firestore";

const DRAFT_BY_BOOK: Partial<Record<string, ReaderPageChunk[]>> = {
  "book-postnatal": BOOK_POSTNATAL_DRAFT_PAGES,
};

export function BookPreviewPage() {
  const { bookId } = useParams<{ bookId: string }>();

  if (!bookId || !isBookId(bookId)) {
    return <Navigate to="/" replace />;
  }

  const book = getBookById(bookId);
  const pages = DRAFT_BY_BOOK[bookId];

  if (!book || !pages?.length) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title={`معاينة — ${book.shortTitle}`} />
      <main className="min-h-screen bg-milk px-4 pb-20 pt-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950">
            <strong>معاينة محلية</strong> — المشتريات يقرأن من Firestore عبر{" "}
            <code className="rounded bg-white/80 px-1 text-xs">/reader/{bookId}</code> بعد الشراء.
            لنشر الكتاب: <code className="rounded bg-white/80 px-1 text-xs">npm run seed:book-postnatal</code>{" "}
            (بعد إعداد مفتاح حساب الخدمة — راجعي التعليمات في المحادثة أو{" "}
            <code className="rounded bg-white/80 px-1 text-xs">scripts/seed-book-postnatal.ts</code>).
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-semibold text-moss-900">{book.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link to={`/books/${book.slug}`} className="text-sage-600 hover:text-sage-800">
                صفحة الشراء
              </Link>
              <Link to="/" className="text-sage-600 hover:text-sage-800">
                الرئيسية
              </Link>
            </div>
          </div>
          <BookReader pages={pages} toc={getBookToc(bookId)} bookId={bookId} />
        </div>
      </main>
    </>
  );
}
