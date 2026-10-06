import type { ReactNode } from "react";

const tones: Record<string, string> = {
  paper: "bg-paper",
  peach: "bg-peach",
  mint: "bg-mint",
  cream: "bg-cream",
  sage: "bg-sage",
  saffron: "bg-saffron",
};

type NoteCardProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
  rotation?: number;
  className?: string;
  as?: "div" | "button";
  onClick?: () => void;
  ariaLabel?: string;
};

export function NoteCard({
  children,
  tone = "paper",
  rotation = 0,
  className = "",
  as = "div",
  onClick,
  ariaLabel,
}: NoteCardProps) {
  const cls = `relative ${tones[tone] ?? tones.paper} border-2 border-ink px-5 py-6 shadow-hard font-hand text-xl leading-snug text-ink ${className}`;
  const style = { transform: `rotate(${rotation}deg)` };

  const tape = (
    <span
      className="absolute -top-2 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[3deg] bg-saffron/45 border border-ink/20"
      aria-hidden
    />
  );

  if (as === "button") {
    return (
      <button type="button" className={cls} style={style} onClick={onClick} aria-label={ariaLabel}>
        {tape}
        {children}
      </button>
    );
  }

  return (
    <div className={cls} style={style}>
      {tape}
      {children}
    </div>
  );
}
