import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { isBookId, THANK_YOU_BOOK_LABELS } from "../data/books";
import { useAuth } from "../hooks/useAuth";
import { userOwnsBook } from "../lib/firestore";
import { LinkButton } from "../components/ui/PrimaryButton";

export function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const book = searchParams.get("book");
  const label = book && isBookId(book) ? THANK_YOU_BOOK_LABELS[book] : null;
  const { user } = useAuth();
  const [readyInLibrary, setReadyInLibrary] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    async function checkAccess() {
      if (!user || !book || !isBookId(book)) return;
      const hasBook = await userOwnsBook(user.uid, book);
      setReadyInLibrary(hasBook);
    }
    void checkAccess();
  }, [book, user]);

  return (
    <>
      <Seo title="شكرًا لك — نوال عمر" />
      <main
        className="min-h-[calc(100vh-12rem)] bg-gradient-to-b from-milk via-mist/80 to-milk px-4 pb-20 pt-28 text-center sm:px-6"
        id="main"
      >
        <motion.div
          className="mx-auto max-w-lg"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-2xl text-sage-600 shadow-soft">
            ✓
          </div>
          <h1 className="mt-8 font-display text-3xl font-semibold text-moss-900">شكرًا لشرائك</h1>
          <p className="mt-4 text-sage-700">تم استلام طلبك، وسيتم إضافة الكتاب إلى مكتبتك بعد التحقق من عملية الدفع.</p>
          {label && (
            <p className="mt-6 text-sm font-semibold text-sage-800">
              الكتاب: <span className="text-sage-600">{label}</span>
            </p>
          )}
          <p className="mt-6 text-sm text-sage-600">
            لأي استفسار تواصلي عبر{" "}
            <Link to="/#contact" className="font-semibold text-sage-700 underline-offset-2 hover:underline">
              صفحة التواصل
            </Link>
            .
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {readyInLibrary && book && isBookId(book) ? (
              <LinkButton to={`/reader/${book}`}>ابدئي القراءة الآن</LinkButton>
            ) : (
              <LinkButton to="/library">اذهبي إلى مكتبتي</LinkButton>
            )}
            <Link
              to="/"
              className="text-sm font-semibold text-sage-600 underline-offset-2 hover:text-sage-800 hover:underline"
            >
              العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  );
}
