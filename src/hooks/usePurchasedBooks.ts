import { useCallback, useEffect, useState } from "react";
import { BOOKS, type Book } from "../data/books";
import { getUserLibrary } from "../lib/firestore";

export function usePurchasedBooks(uid: string | undefined) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!uid) {
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const library = await getUserLibrary(uid);
    const paidIds = library.filter((item) => item.status === "paid").map((item) => item.bookId);
    setBooks(BOOKS.filter((b) => paidIds.includes(b.id)));
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { books, loading, reload };
}
