import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuthErrorMessage } from "../../lib/authErrors";
import { firebaseConfigError, isFirebaseConfigured } from "../../lib/firebase";
import { SiteLogo } from "../brand/SiteLogo";
import { MobileNavMenu } from "./MobileNavMenu";
import { DirectionHint } from "../ui/DirectionHint";
import { conversionBooks, faq, howItWorks, navCopy, quizzes } from "../../data/content.ar";
import { isMotionOff, setMotionOff } from "../../lib/motionPrefs";

type SiteNavProps = {
  variant?: "full" | "quiz";
};

const linkClass =
  "text-[0.9rem] font-medium text-ink/85 transition-colors hover:text-terracotta";

const ctaLinkClass =
  "text-[0.9rem] font-semibold text-terracotta transition-colors hover:text-ink";

export function SiteNav({ variant = "full" }: SiteNavProps) {
  const { user, signInWithGoogle, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const [rtl, setRtl] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [motionOff, setMotionOffState] = useState(isMotionOff());

  useEffect(() => {
    setRtl(document.documentElement.dir === "rtl");
  }, []);

  useEffect(() => {
    if (variant !== "full") return;
    const onScroll = () => {
      const y = window.scrollY;
      setNavVisible(y < 60 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const toggleMotion = () => {
    const next = !motionOff;
    setMotionOff(next);
    setMotionOffState(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthError(firebaseConfigError);
    }
  }, []);

  const close = () => setOpen(false);
  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      if (!msg.includes("تحويل")) setAuthError(msg);
    }
  };

  const mainLinks = [
    ["كيف يعمل", `/#${howItWorks.id}`],
    ["الاستبيانات", `/#${quizzes.id}`],
    ["الكتب", `/#${conversionBooks.id}`],
    ["أسئلة", `/#${faq.id}`],
  ] as const;

  if (variant === "quiz") {
    return (
      <header className="fixed start-0 end-0 top-0 z-[100] border-b border-ink/10 bg-cream/95">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <SiteLogo size="sm" showTagline={false} />
          <Link to="/#quizzes" className={`${linkClass} inline-flex items-center gap-1`}>
            العودة
            <DirectionHint direction="back" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
    <header
      className={`fixed start-0 end-0 top-3 z-[100] flex justify-center px-3 transition-transform duration-500 sm:top-4 sm:px-4 ${
        open || navVisible ? "translate-y-0" : "-translate-y-[140%]"
      }`}
    >
      <div
        className="flex h-12 w-full max-w-[min(94vw,1000px)] items-center justify-between gap-2 rounded-[999px] border border-ink/80 bg-cream/95 px-3 shadow-[3px_3px_0_var(--ink)] backdrop-blur-sm sm:h-14 sm:gap-4 sm:px-5"
      >
        <SiteLogo onClick={close} />

        <nav className="hidden items-center gap-4 lg:flex lg:gap-5" aria-label="القائمة الرئيسية">
          {mainLinks.map(([label, to]) => (
            <Link key={to} to={to} className={linkClass}>
              {label}
            </Link>
          ))}
          <Link to="/#quizzes" className={ctaLinkClass}>
            {navCopy.ctaQuiz}
          </Link>
          {user ? (
            <Link to="/library" className={linkClass}>
              مكتبتي
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex lg:hidden">
          <Link to="/#quizzes" className={ctaLinkClass}>
            {navCopy.ctaQuiz}
          </Link>
        </div>

        <button
          type="button"
          className="relative z-[110] flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 rounded-lg lg:hidden"
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-5 origin-center rounded-full bg-ink"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block h-0.5 w-5 rounded-full bg-ink"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-5 origin-center rounded-full bg-ink"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
        </button>
      </div>

      {authError ? (
        <p className="mx-auto mt-2 max-w-[min(94vw,1000px)] rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
          {authError}
        </p>
      ) : null}
    </header>

    <MobileNavMenu
      open={open}
      onClose={close}
      rtl={rtl}
      mainLinks={mainLinks}
      quizHref="/#quizzes"
      libraryHref={user ? "/library" : undefined}
      footerActions={
        <div className="flex flex-col gap-2.5 text-sm font-medium sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
          <button type="button" onClick={toggleMotion} className="min-h-9 text-start text-cream/75 hover:text-saffron">
            {motionOff ? navCopy.resumeMotion : navCopy.stopMotion}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="min-h-9 text-cream/75 hover:text-saffron" onClick={close}>
                لوحة الحساب
              </Link>
              <button type="button" onClick={() => void logout()} className="min-h-9 text-start text-cream/75 hover:text-saffron">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void handleSignIn()}
              disabled={!isFirebaseConfigured}
              className="min-h-9 text-start text-cream/75 hover:text-saffron disabled:opacity-50"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      }
    />
    </>
  );
}
