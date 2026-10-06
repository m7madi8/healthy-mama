import { Link, Navigate, useParams } from "react-router-dom";
import { BookReader } from "../components/reader/BookReader";
import { Seo } from "../components/layout/Seo";
import { getBookById, isBookId } from "../data/books";
import { getLocalBookPages } from "../data/bookLocalPages";
import { getBookToc } from "../data/book-postnatal-toc";

export function BookPreviewPage() {
  const { bookId } = useParams<{ bookId: string }>();

  if (!bookId || !isBookId(bookId)) {
    return <Navigate to="/" replace />;
  }

  const book = getBookById(bookId);
  const pages = getLocalBookPages(bookId);

  if (!book || !pages?.length) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title={`معاينة — ${book.shortTitle}`} />
      <main className="min-h-screen bg-milk px-4 pb-20 pt-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
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
