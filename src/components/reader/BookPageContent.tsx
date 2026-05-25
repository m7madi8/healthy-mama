import { useMemo } from "react";
import { parseBookContent } from "./parseBookContent";

type BookPageContentProps = {
  content: string;
};

export function BookPageContent({ content }: BookPageContentProps) {
  const blocks = useMemo(() => parseBookContent(content), [content]);

  return (
    <div className="book-prose space-y-5">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={idx} className="text-[1.06rem] leading-[1.85] text-sage-800">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={idx} className="space-y-2.5 rounded-2xl border border-sage-100/90 bg-sage-50/50 px-4 py-4 sm:px-5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[1.02rem] leading-relaxed text-sage-800">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "checklist":
            return (
              <ul key={idx} className="space-y-2 rounded-2xl border border-sage-100 bg-white px-4 py-4 shadow-sm sm:px-5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[1.02rem] leading-relaxed text-sage-800">
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-sage-300 bg-milk text-[10px] text-transparent"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className="relative rounded-2xl border-s-4 border-sage-400 bg-gradient-to-l from-blush/80 to-petal/90 px-5 py-4 font-medium leading-relaxed text-moss-900 shadow-sm"
              >
                {block.text}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={idx}
                className="overflow-hidden rounded-2xl border border-sage-200/80 bg-gradient-to-b from-white to-sage-50/60 shadow-soft"
              >
                <p className="bg-sage-600/95 px-4 py-2.5 text-sm font-bold tracking-wide text-white">{block.label}</p>
                <div className="space-y-3 px-4 py-4">
                  {block.lines.map((line, j) =>
                    isQuoteLine(line) ? (
                      <blockquote key={j} className="rounded-xl bg-blush/60 px-4 py-3 text-[1.02rem] font-medium text-moss-900">
                        {line}
                      </blockquote>
                    ) : (
                      <p key={j} className="text-[1.02rem] leading-relaxed text-sage-800">
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </aside>
            );
          case "subheading":
            return (
              <h3 key={idx} className="pt-2 font-display text-lg font-semibold text-moss-900">
                {block.text}
              </h3>
            );
          case "fill":
            return (
              <div key={idx} className="rounded-2xl border border-dashed border-sage-200 bg-mist/50 px-4 py-4">
                {block.label ? <p className="mb-2 text-sm font-semibold text-sage-700">{block.label}</p> : null}
                <div className="h-12 rounded-lg border border-sage-100 bg-white/80" aria-hidden />
                <div className="mt-2 h-12 rounded-lg border border-sage-100 bg-white/80" aria-hidden />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function isQuoteLine(line: string): boolean {
  const t = line.trim();
  return (t.startsWith("“") && t.endsWith("”")) || (t.startsWith('"') && t.endsWith('"'));
}
