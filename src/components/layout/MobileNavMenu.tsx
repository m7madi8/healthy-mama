import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { navCopy } from "../../data/content.ar";
import { SiteLogo } from "../brand/SiteLogo";

export type MobileNavLink = readonly [label: string, to: string];

type MobileNavMenuProps = {
  open: boolean;
  onClose: () => void;
  rtl: boolean;
  mainLinks: readonly MobileNavLink[];
  quizHref: string;
  libraryHref?: string;
  footerActions: ReactNode;
};

function MenuCloseButton({ onClose, reduce }: { onClose: () => void; reduce: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClose}
      aria-label={navCopy.menuClose}
      className="group relative shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-saffron"
      whileTap={reduce ? undefined : { scale: 0.96 }}
    >
      <span
        className="pointer-events-none absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-[999px] bg-cream/25"
        aria-hidden
      />
      <span
        className="relative flex min-h-[3rem] items-center gap-2.5 rounded-[999px] border-2 border-cream bg-saffron px-4 py-2 text-ink shadow-[4px_4px_0_var(--cream)] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0_var(--cream)] group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-[2px_2px_0_var(--cream)]"
        style={{ transform: "rotate(-3deg)" }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink/80 bg-cream" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4 4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6.5" stroke="var(--terracotta)" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.85" />
          </svg>
        </span>
        <span className="font-display text-base leading-none">{navCopy.menuClose}</span>
      </span>
    </motion.button>
  );
}

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panel: Variants = {
  hidden: { opacity: 0, y: "-8%", scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 32, stiffness: 280, mass: 0.85 },
  },
  exit: {
    opacity: 0,
    y: "-4%",
    transition: { duration: 0.22, ease: [0.76, 0, 0.24, 1] },
  },
};

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.14 } },
};

export function MobileNavMenu({
  open,
  onClose,
  rtl,
  mainLinks,
  quizHref,
  libraryHref,
  footerActions,
}: MobileNavMenuProps) {
  const reduce = useReducedMotion();
  const itemMotion: Variants = reduce
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : {
        hidden: { opacity: 0, x: rtl ? 28 : -28 },
        show: {
          opacity: 1,
          x: 0,
          transition: { type: "spring", damping: 26, stiffness: 340 },
        },
      };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="menu-backdrop"
            className="fixed inset-0 z-[200] bg-forest/70 backdrop-blur-md lg:hidden"
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            aria-hidden
          />
          <motion.nav
            key="menu-panel"
            className="fixed start-0 end-0 top-0 z-[210] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden border-b-4 border-dashed border-cream/20 bg-forest lg:hidden"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
            variants={reduce ? undefined : panel}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit="exit"
            aria-label="قائمة الجوال"
            aria-modal="true"
          >
            <div
              className="pointer-events-none absolute -end-8 top-24 h-48 w-48 rounded-full bg-saffron/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -start-12 bottom-32 h-56 w-56 rounded-full bg-terracotta/15 blur-3xl"
              aria-hidden
            />
            <p
              className="pointer-events-none absolute start-4 top-[28%] font-display text-[clamp(4rem,28vw,9rem)] leading-none text-cream/[0.06] select-none"
              aria-hidden
            >
              قائمة
            </p>

            <header className="relative z-10 flex shrink-0 items-start justify-between gap-3 px-4 pb-4 pt-3 sm:px-6 sm:pt-4">
              <SiteLogo tone="dark" size="sm" showTagline={false} onClick={onClose} />
              <MenuCloseButton onClose={onClose} reduce={!!reduce} />
            </header>

            <motion.div
              className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain px-4 sm:px-6"
              variants={reduce ? undefined : list}
              initial={reduce ? false : "hidden"}
              animate="show"
            >
              <ul className="mx-auto w-full max-w-md space-y-1">
                {mainLinks.map(([label, to], index) => (
                  <motion.li key={to} variants={itemMotion}>
                    <Link
                      to={to}
                      onClick={onClose}
                      className="group flex min-h-[3.75rem] items-center gap-4 rounded-2xl border border-transparent px-2 py-2 transition-colors hover:border-cream/15 hover:bg-cream/5 active:bg-cream/10"
                    >
                      <span
                        className="font-hand text-2xl leading-none text-terracotta/90 tabular-nums"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[clamp(1.55rem,7vw,2.35rem)] leading-tight text-cream transition-colors group-hover:text-saffron">
                        {label}
                      </span>
                      <span
                        className="ms-auto h-px w-8 bg-cream/0 transition-all group-hover:w-12 group-hover:bg-cream/35"
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                ))}

                <motion.li variants={itemMotion} className="pt-3">
                  <Link
                    to={quizHref}
                    onClick={onClose}
                    className="flex min-h-[3.75rem] items-center justify-between gap-3 rounded-2xl border-2 border-saffron bg-saffron/15 px-4 py-3 shadow-[4px_4px_0_color-mix(in_srgb,var(--cream)_35%,transparent)] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span className="font-display text-[clamp(1.35rem,6vw,2rem)] leading-tight text-cream">
                      {navCopy.ctaQuiz}
                    </span>
                    <span className="rounded-full border border-cream/50 bg-cream/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cream">
                      مجاني
                    </span>
                  </Link>
                </motion.li>

                {libraryHref ? (
                  <motion.li variants={itemMotion}>
                    <Link
                      to={libraryHref}
                      onClick={onClose}
                      className="group flex min-h-[3.25rem] items-center gap-4 rounded-2xl px-2 py-2 text-cream/90"
                    >
                      <span className="font-hand text-xl text-cream/40" aria-hidden>✦</span>
                      <span className="font-display text-[clamp(1.2rem,5vw,1.65rem)]">مكتبتي</span>
                    </Link>
                  </motion.li>
                ) : null}
              </ul>
            </motion.div>

            <footer className="relative z-10 shrink-0 px-4 pb-4 pt-2 sm:px-6 sm:pb-5">
              <div className="mx-auto w-full max-w-md rounded-2xl border border-dashed border-cream/25 bg-cream/5 px-4 py-3.5 backdrop-blur-sm">
                {footerActions}
              </div>
            </footer>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
