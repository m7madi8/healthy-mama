import type { BookTocEntry } from "../../data/book-postnatal-toc";

type BookTocProps = {
  entries: BookTocEntry[];
  totalPages: number;
  onSelect: (pageIndex: number) => void;
};

export function BookToc({ entries, totalPages, onSelect }: BookTocProps) {
  return (
    <nav aria-label="فهرس الدليل" className="space-y-1">
      <p className="mb-5 rounded-2xl bg-sage-50/80 px-4 py-3 text-sm leading-relaxed text-sage-600">
        اختاري فصلًا للانتقال مباشرة · {totalPages} صفحة في الدليل
      </p>
      <ol className="grid gap-2 sm:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.chapter}>
            <button
              type="button"
              onClick={() => onSelect(entry.pageIndex)}
              className="group flex h-full w-full flex-col rounded-2xl border border-sage-100 bg-white p-3.5 text-start shadow-sm transition-all hover:border-sage-300 hover:bg-sage-50/50 hover:shadow-soft"
            >
              <span className="mb-1.5 inline-flex w-fit rounded-pill bg-sage-100 px-2.5 py-0.5 text-xs font-bold tabular-nums text-sage-700">
                {entry.chapter}
              </span>
              <span className="flex-1 text-sm font-semibold leading-snug text-moss-900 group-hover:text-sage-800">
                {entry.shortTitle ?? entry.title}
              </span>
              <span className="mt-2 text-xs tabular-nums text-sage-500">ص {entry.pageIndex + 1}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-5 rounded-xl border border-sage-100 bg-mist/40 px-3 py-2.5 text-xs leading-relaxed text-sage-500">
        ص 13: قصة تعليمية · ص 19–22: تمارين تنفس
      </p>
    </nav>
  );
}
