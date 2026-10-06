import { conversionBooks } from "../../data/content.ar";
import { getBookById } from "../../data/books";
import { SectionInner } from "../editorial/SectionInner";
import { BooksCarousel } from "./BooksCarousel";
import { BookStoreCard } from "./BookStoreCard";

export function BooksSection() {
  const carouselItems = conversionBooks.items.map((book) => {
    const catalog = getBookById(book.id);
    const canBuy = Boolean(book.price && book.buyUrl);
    return {
      bookId: book.id,
      title: catalog?.shortTitle ?? book.title,
      outcome: book.outcome,
      price: book.price,
      buyUrl: book.buyUrl,
      canBuy,
    };
  });

  return (
    <section id={conversionBooks.id} className="relative scroll-mt-24 bg-mint/40 py-14 md:py-20" data-thread-anchor="books">
      <SectionInner>
        <header className="mb-8 border-b-2 border-ink/15 pb-5 md:mb-10">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-ink">
            {conversionBooks.title}
          </h2>
          <p className="mt-2 text-base text-ink/75 md:text-lg">{conversionBooks.intro}</p>
        </header>

        <BooksCarousel items={carouselItems} />

        <ul className="hidden grid-cols-2 gap-3 sm:gap-5 md:grid lg:grid-cols-4 lg:gap-6">
          {carouselItems.map((item) => (
            <li key={item.bookId} className="min-w-0">
              <BookStoreCard {...item} layout="grid" />
            </li>
          ))}
        </ul>
      </SectionInner>
    </section>
  );
}
