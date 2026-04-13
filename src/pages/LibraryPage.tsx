import { Link } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { LibraryCard } from "../components/library/LibraryCard";
import { useAuth } from "../hooks/useAuth";
import { usePurchasedBooks } from "../hooks/usePurchasedBooks";

export function LibraryPage() {
  const { user } = useAuth();
  const { books, loading } = usePurchasedBooks(user?.uid);

  return (
    <>
      <Seo title="مكتبتي الرقمية — Healthy Mama" />
      <main className="min-h-screen bg-milk px-4 pb-20 pt-28 sm:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold text-moss-900">مكتبتي الرقمية</h1>
              <p className="mt-2 text-sage-600">كتبك المشتراة متاحة هنا للقراءة مباشرة داخل الموقع.</p>
            </div>
            <Link
              to="/dashboard"
              className="shrink-0 text-sm font-semibold text-sage-600 underline-offset-4 hover:text-sage-900 hover:underline"
            >
              ← لوحة الحساب
            </Link>
          </div>

          {loading ? (
            <p className="mt-10 text-sm text-sage-600">جاري تحميل المكتبة...</p>
          ) : books.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-sage-100 bg-white p-8 text-center shadow-soft">
              <p className="text-sage-700">لا توجد كتب مشتراة بعد.</p>
              <Link
                to="/dashboard"
                className="mt-4 inline-block text-sm font-semibold text-sage-600 hover:text-sage-900"
              >
                العودة إلى لوحة الحساب
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <LibraryCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
