import { Link } from "react-router-dom";
import { conversionBooks } from "../../data/content.ar";
import { getBookById, type BookId } from "../../data/books";
import { trackEvent } from "../../lib/analytics";
import { BookCover } from "../book/BookCover";
import { EditorialLinkButton } from "../ui/EditorialButton";

const COVER_ASPECT = "3 / 4";

export type BookStoreCardProps = {
  bookId: BookId;
  title: string;
  outcome: string;
  price: number | null;
  buyUrl: string;
  canBuy: boolean;
  layout?: "grid" | "carousel";
};

export function BookStoreCard({
  bookId,
  title,
  outcome,
  price,
  buyUrl,
  canBuy,
  layout = "grid",
}: BookStoreCardProps) {
  const catalog = getBookById(bookId);
  const featured = layout === "carousel";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden border-2 border-ink bg-paper shadow-hard ${
        featured ? "rounded-[1.35rem]" : "rounded-2xl"
      }`}
    >
      <Link
        to={buyUrl}
        className="block w-full shrink-0 border-b-2 border-ink"
        style={{ aspectRatio: COVER_ASPECT }}
        onClick={() => trackEvent("click_buy", { book: bookId })}
      >
        {catalog ? (
          <BookCover book={catalog} size="store" fit="cover" className="h-full w-full !aspect-auto min-h-0" />
        ) : null}
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? "p-4 sm:p-5" : "p-3 sm:p-4"}`}>
        <h3
          className={`font-display leading-snug text-ink ${
            featured ? "text-[clamp(1.35rem,5vw,1.75rem)]" : "text-[clamp(1rem,3.8vw,1.5rem)]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 leading-relaxed text-ink/80 ${
            featured ? "line-clamp-3 text-base" : "mt-1.5 line-clamp-2 text-sm sm:text-base"
          }`}
        >
          {outcome}
        </p>

        <div className="mt-auto flex flex-col gap-3 border-t-2 border-dashed border-ink/20 pt-4">
          {price != null ? (
            <p className={`font-display text-ink ${featured ? "text-2xl" : "text-xl sm:text-2xl"}`}>
              {price}
              <span className="ms-1 font-sans text-sm font-medium">₪</span>
            </p>
          ) : null}
          {canBuy ? (
            <EditorialLinkButton
              to={buyUrl}
              variant="solid"
              className={`!w-full !px-3 ${featured ? "!min-h-12 !text-base" : "!min-h-11 !text-sm"}`}
            >
              {conversionBooks.buyNow}
            </EditorialLinkButton>
          ) : (
            <span className="text-sm font-semibold text-forest">{conversionBooks.comingSoon}</span>
          )}
        </div>
      </div>
    </article>
  );
}
