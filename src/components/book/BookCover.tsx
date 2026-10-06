import type { Book } from "../../data/books";

type CoverSize = "card" | "portrait" | "thumb" | "fill" | "store";

type BookCoverProps = {
  book: Book;
  size?: CoverSize;
  className?: string;
  /** contain يُظهر الغلاف كاملًا (مناسب لمتجر الجوال) */
  fit?: "cover" | "contain";
};

const sizeClass: Record<CoverSize, string> = {
  card: "aspect-[4/3] w-full",
  portrait: "aspect-[3/4] w-full",
  thumb: "h-14 w-10 shrink-0",
  fill: "h-full w-full min-h-[12rem]",
  store: "h-full w-full min-h-0",
};

export function bookCoverAlt(book: Book): string {
  return `غلاف دليل «${book.shortTitle}» — نوال عمر`;
}

export function BookCover({ book, size = "card", className = "", fit = "cover" }: BookCoverProps) {
  const imgFit = fit === "contain" ? "object-contain object-center" : "object-cover object-center";
  const wrapBg = fit === "contain" ? "bg-cream" : "bg-mist";
  return (
    <div className={`overflow-hidden ${wrapBg} ${sizeClass[size]} ${className}`.trim()}>
      <img
        src={book.coverSrc}
        alt={bookCoverAlt(book)}
        className={`h-full w-full ${imgFit}`}
        loading="lazy"
      />
    </div>
  );
}
