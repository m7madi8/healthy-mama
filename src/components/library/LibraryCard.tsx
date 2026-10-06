import { Link } from "react-router-dom";
import type { Book } from "../../data/books";
import { BookCover } from "../book/BookCover";

type LibraryCardProps = {
  book: Book;
};

export function LibraryCard({ book }: LibraryCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft">
      <BookCover book={book} className="aspect-[4/3]" />
      <div className="space-y-3 p-5">
        <h2 className="font-display text-xl font-semibold text-moss-900">{book.shortTitle}</h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-sage-700">{book.cardDescription}</p>
        <Link
          to={`/reader/${book.id}`}
          className="inline-flex rounded-pill bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sage-500"
        >
          اكملي القراءة
        </Link>
      </div>
    </article>
  );
}
