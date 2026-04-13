import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { scrollTransition, scrollViewport } from "./motionPresets";

export type MotionFadeVariant = "fade-up" | "fade-down" | "gentle-zoom";

const variantMap: Record<
  MotionFadeVariant,
  { initial: Record<string, number>; animate: Record<string, number> }
> = {
  "fade-up": { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } },
  "fade-down": { initial: { opacity: 0, y: -22 }, animate: { opacity: 1, y: 0 } },
  "gentle-zoom": { initial: { opacity: 0, y: 18, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } },
};

type MotionFadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** نمط الظهور عند التمرير */
  variant?: MotionFadeVariant;
};

export function MotionFade({ children, className, delay = 0, variant = "fade-up" }: MotionFadeProps) {
  const reduce = useReducedMotion();
  const v = variantMap[variant];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={v.initial}
      whileInView={v.animate}
      viewport={scrollViewport}
      transition={{ ...scrollTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
