import { motion, useReducedMotion } from "framer-motion";
import { scrollTransition, scrollViewport } from "../ui/motionPresets";
import { LinkButton } from "../ui/PrimaryButton";

type CtaBandProps = {
  id?: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  to: string;
};

export function CtaBand({ id, title, subtitle, buttonText, to }: CtaBandProps) {
  const reduce = useReducedMotion();
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={reduce ? false : { opacity: 0, y: 26, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={scrollViewport}
        transition={reduce ? { duration: 0 } : { ...scrollTransition }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-sage-100 bg-gradient-to-br from-sage-50 via-milk to-blush px-8 py-12 text-center shadow-soft sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sage-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/60 blur-2xl" />
          <h2 className="relative font-display text-2xl font-semibold tracking-tight text-moss-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="relative mx-auto mt-3 max-w-lg text-sage-700">{subtitle}</p>}
          <div className="relative mt-8 flex justify-center">
            <LinkButton to={to}>{buttonText}</LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
