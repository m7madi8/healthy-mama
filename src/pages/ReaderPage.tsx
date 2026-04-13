import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { BookReader } from "../components/reader/BookReader";
import { getBookById, isBookId } from "../data/books";
import { getBookPages, type ReaderPageChunk } from "../lib/firestore";

export function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [pages, setPages] = useState<ReaderPageChunk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPages() {
      if (!bookId || !isBookId(bookId)) {
        setLoading(false);
        return;
      }
      const data = await getBookPages(bookId);
      setPages(data);
      setLoading(false);
    }

    void loadPages();
  }, [bookId]);

  if (!bookId || !isBookId(bookId)) {
    return <Navigate to="/" replace />;
  }

  const book = getBookById(bookId);
  if (!book) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title={`${book.shortTitle} — القارئ`} />
      <main className="min-h-screen bg-milk px-4 pb-20 pt-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl font-semibold text-moss-900">{book.shortTitle}</h1>
            <Link to="/library" className="text-sm font-semibold text-sage-600 hover:text-sage-800">
              العودة للمكتبة
            </Link>
          </div>
          {loading ? <p className="text-sm text-sage-600">جاري تحميل محتوى الكتاب...</p> : <BookReader pages={pages} />}
        </div>
      </main>
    </>
  );
}
