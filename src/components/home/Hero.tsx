import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { scrollViewport } from "../ui/motionPresets";
import { LinkButton } from "../ui/PrimaryButton";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-[4.25rem]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(197,214,199,0.45),transparent)]" />
      <div className="pointer-events-none absolute -end-24 top-32 h-72 w-72 rounded-full bg-blush/60 blur-3xl" />
      <div className="pointer-events-none absolute -start-16 bottom-20 h-64 w-64 rounded-full bg-sage-100/80 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:py-28">
        <div>
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-pill border border-sage-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-sage-600 shadow-sm backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span aria-hidden>🌿</span> صحة الأم والحمل وما بعد الولادة
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(2.25rem,5vw,3.35rem)] font-semibold leading-[1.2] tracking-tight text-moss-900"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            اكتشفي صحتك في دقائق <span className="text-sage-600">🌿</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-md text-lg leading-relaxed text-sage-700/95"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            استبيان بسيط يمنحك توصية مخصصة بكتاب يناسب حالتك — خطوات واضحة نحو الشعور بمزيد من الأمان والتوازن.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <LinkButton to="/#quiz-section">ابدئي الاستبيان</LinkButton>
            <Link
              to="/#how-it-works"
              className="text-sm font-semibold text-sage-600 underline-offset-4 transition-colors hover:text-sage-800 hover:underline"
            >
              كيف يعمل الموقع؟
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-md md:max-w-none"
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ ...scrollViewport, amount: 0.35 }}
          transition={{ duration: 0.68, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/80 bg-petal shadow-lift ring-1 ring-sage-100/60">
            <img
              src="/healthymama.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              width={800}
              height={1000}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-moss-900/25 via-transparent to-transparent" />
          </div>
          <motion.div
            className="absolute -bottom-4 -end-4 hidden rounded-2xl border border-sage-100 bg-white/95 px-5 py-4 shadow-soft backdrop-blur-md sm:block md:-end-6"
            initial={reduce ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold tracking-wide text-sage-500">لستِ وحدك</p>
            <p className="mt-1 font-display text-lg font-semibold leading-snug text-sage-800 sm:text-xl">
              مشاعرك حق — والوضوح يبدأ هنا.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
