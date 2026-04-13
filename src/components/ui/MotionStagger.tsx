import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { scrollEase, scrollViewport } from "./motionPresets";

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  /** تأخير بين كل عنصر وآخر (ثوانٍ) */
  stagger?: number;
  /** تأخير قبل أول عنصر */
  delayChildren?: number;
};

const itemDuration = 0.58;

/**
 * حاوية تُظهر الأبناء متتابعين عند دخول القسم إلى الشاشة.
 * كل طفل مباشر يجب أن يكون `MotionStaggerItem`.
 */
export function MotionStagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0.04,
}: MotionStaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function MotionStaggerItem({ children, className }: MotionStaggerItemProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: itemDuration, ease: scrollEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
