import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getBookById, isBookId } from "../../data/books";
import { userOwnsBook } from "../../lib/firestore";

type RequirePurchaseProps = {
  children: ReactNode;
};

export function RequirePurchase({ children }: RequirePurchaseProps) {
  const { user } = useAuth();
  const { bookId } = useParams<{ bookId: string }>();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function verifyAccess() {
      if (!user || !bookId || !isBookId(bookId)) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      const owns = await userOwnsBook(user.uid, bookId);
      setAllowed(owns);
      setChecking(false);
    }

    void verifyAccess();
  }, [bookId, user]);

  if (!bookId || !isBookId(bookId) || !getBookById(bookId)) {
    return <Navigate to="/" replace />;
  }

  if (checking) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-3xl px-4 pt-28 text-center sm:px-6">
        <p className="text-sm text-sage-600">جاري التحقق من صلاحية الوصول...</p>
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to={`/books/${bookId}`} replace />;
  }

  return <>{children}</>;
}
