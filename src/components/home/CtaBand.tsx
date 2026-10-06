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
        <div className="rounded-[2rem] border border-sage-100 bg-gradient-to-br from-sage-50 via-milk to-blush px-8 py-12 text-center shadow-soft sm:px-12 sm:py-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-moss-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-3 max-w-lg text-sage-700">{subtitle}</p>}
          <div className="mt-8 flex justify-center">
            <LinkButton to={to}>{buttonText}</LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
