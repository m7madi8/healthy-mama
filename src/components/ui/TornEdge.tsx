type TornEdgeProps = {
  fill: string;
  className?: string;
};

export function TornEdge({ fill, className = "" }: TornEdgeProps) {
  return (
    <div className={`relative h-8 w-full ${className}`} aria-hidden>
      <svg className="absolute bottom-0 block h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 32">
        <path
          d="M0,8 L40,2 L80,12 L120,4 L160,14 L200,6 L240,16 L280,5 L320,15 L360,7 L400,18 L440,9 L480,17 L520,6 L560,14 L600,4 L640,12 L680,3 L720,11 L760,5 L800,15 L840,8 L880,16 L920,6 L960,13 L1000,4 L1040,11 L1080,6 L1120,14 L1160,8 L1200,10 L1200,32 L0,32 Z"
          fill={fill}
        />
      </svg>
      <div className="absolute -bottom-1 h-2 w-full opacity-30" style={{ background: fill, transform: "translateY(6px)" }} />
    </div>
  );
}
