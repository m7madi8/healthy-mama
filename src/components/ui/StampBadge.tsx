type StampBadgeProps = {
  text: string;
  rotation?: number;
  className?: string;
};

export function StampBadge({ text, rotation = -8, className = "" }: StampBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full border-[3px] border-ink/85 px-5 py-2 font-hand text-lg text-ink/85 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {text}
    </span>
  );
}
