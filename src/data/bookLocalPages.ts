import type { BookId } from "./books";
import { BOOK_POSTNATAL_DRAFT_PAGES } from "./book-postnatal-draft";
import type { ReaderPageChunk } from "../lib/firestore";

/** محتوى مضمّن في التطبيق — يُستخدم إذا لم تُرفع الصفحات بعد إلى Firestore */
const LOCAL_BOOK_PAGES: Partial<Record<BookId, ReaderPageChunk[]>> = {
  "book-postnatal": BOOK_POSTNATAL_DRAFT_PAGES,
};

export function getLocalBookPages(bookId: BookId): ReaderPageChunk[] | undefined {
  return LOCAL_BOOK_PAGES[bookId];
}
