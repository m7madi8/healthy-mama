import { useEffect, useRef, useState } from "react";
import type { BookId } from "../../data/books";
import { BookStoreCard } from "./BookStoreCard";

export type BookCarouselItem = {
  bookId: BookId;
  title: string;
  outcome: string;
  price: number | null;
  buyUrl: string;
  canBuy: boolean;
};

type BooksCarouselProps = {
  items: BookCarouselItem[];
};

export function BooksCarousel({ items }: BooksCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-book-slide]"));
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.slideIndex);
          if (Number.isNaN(index)) continue;
          ratios.set(index, entry.intersectionRatio);
        }
        let bestIndex = 0;
        let bestRatio = 0;
        ratios.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });
        if (bestRatio > 0.2) setActive(bestIndex);
      },
      { root: track, threshold: [0.25, 0.4, 0.55, 0.7, 0.85] },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="relative md:hidden">
      <p className="mb-4 text-center text-sm font-medium tracking-wide text-ink/55">اسحبي لاستكشاف الأدلة</p>

      <div
        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-e from-mint/95 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-s from-mint/95 to-transparent"
        aria-hidden
      />

      <div
        ref={trackRef}
        className="books-carousel-track flex gap-5 overflow-x-auto overscroll-x-contain px-[max(1.25rem,calc((100%-min(88vw,22rem))/2))] pb-2 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="أدلة رقمية"
      >
        {items.map((book, index) => (
          <div
            key={book.bookId}
            data-book-slide
            data-slide-index={index}
            className="w-[min(88vw,22rem)] shrink-0 snap-center snap-always transition-[transform,opacity] duration-300 ease-out"
            style={{
              opacity: active === index ? 1 : 0.78,
              transform: active === index ? "scale(1)" : "scale(0.965)",
            }}
          >
            <BookStoreCard {...book} layout="carousel" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((book, index) => (
          <button
            key={book.bookId}
            type="button"
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === index ? "w-8 bg-terracotta" : "w-2 bg-ink/20 hover:bg-ink/35"
            }`}
            aria-label={`الدليل ${index + 1}: ${book.title}`}
            aria-current={active === index ? "true" : undefined}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-medium tabular-nums text-ink/45">
        {active + 1} / {items.length}
      </p>
    </div>
  );
}
