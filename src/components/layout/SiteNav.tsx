import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavScrolled } from "../../hooks/useNavScroll";
import { useAuth } from "../../hooks/useAuth";
import { getInstagramUrl, getWhatsappUrl } from "../../lib/env";
import { getAuthErrorMessage } from "../../lib/authErrors";
import { firebaseConfigError, isFirebaseConfigured } from "../../lib/firebase";
import { btnPrimary } from "../ui/PrimaryButton";

type SiteNavProps = {
  variant?: "full" | "quiz";
};

const linkClass =
  "text-[0.95rem] font-medium text-sage-800/90 transition-colors hover:text-sage-600 relative after:absolute after:start-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sage-500 after:transition-all hover:after:w-full";

export function SiteNav({ variant = "full" }: SiteNavProps) {
  const scrolled = useNavScrolled();
  const { user, signInWithGoogle, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const [rtl, setRtl] = useState(true);

  useEffect(() => {
    setRtl(document.documentElement.dir === "rtl");
  }, []);

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
  const drawerXClosed = rtl ? "-100%" : "100%";
  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    }
  };

  if (variant === "quiz") {
    return (
      <header className="fixed start-0 end-0 top-0 z-[100] border-b border-sage-100/80 bg-milk/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <span className="block font-display text-lg font-semibold tracking-tight text-sage-800">نوال عمر</span>
            <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sage-500">
              Healthy Mama
            </span>
          </Link>
          <Link
            to="/#quiz-section"
            className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
          >
            العودة للاستبيانات ←
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed start-0 end-0 top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "border-b border-sage-100/90 bg-white/95 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-milk/75 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="transition-opacity hover:opacity-80"
          onClick={close}
        >
          <span className="block font-display text-xl font-semibold tracking-tight text-sage-800">نوال عمر</span>
          <span className="mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sage-500">
            Healthy Mama
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="القائمة الرئيسية">
          <Link to="/#how-it-works" className={linkClass}>
            كيف يعمل
          </Link>
          <Link to="/#wellness-tips" className={linkClass}>
            نصائح مفيدة
          </Link>
          <Link to="/#quiz-section" className={linkClass}>
            الاستبيانات
          </Link>
          <Link to="/#quiz-results" className={linkClass}>
            الكتب
          </Link>
          <Link to="/#contact" className={linkClass}>
            التواصل
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-sage-700 transition-colors hover:text-sage-900"
              >
                لوحة الحساب
              </Link>
              <Link to="/library" className="text-sm font-semibold text-sage-700 transition-colors hover:text-sage-900">
                مكتبتي
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-pill border border-sage-200 bg-white px-4 py-2 text-sm font-semibold text-sage-700 transition-colors hover:border-sage-300"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void handleSignIn()}
              disabled={!isFirebaseConfigured}
              className="rounded-pill border border-sage-200 bg-white px-4 py-2 text-sm font-semibold text-sage-700 transition-colors hover:border-sage-300"
            >
              تسجيل الدخول
            </button>
          )}
          <a
            href={getWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-sage-200 bg-white px-4 py-2 text-sm font-semibold text-sage-700 shadow-sm transition-all hover:border-sage-300 hover:shadow-md"
          >
            واتساب
          </a>
          <a
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage-500 transition-colors hover:text-sage-700"
            aria-label="إنستغرام"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3Zm10.25 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 origin-center rounded-full bg-sage-800"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block h-0.5 w-6 rounded-full bg-sage-800"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 origin-center rounded-full bg-sage-800"
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
        </button>
      </div>
      {authError && (
        <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{authError}</p>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[105] bg-moss-900/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-[108] flex min-h-dvh w-full flex-col bg-milk px-6 shadow-lift md:hidden"
            style={{
              paddingTop: "max(5.25rem, calc(4.25rem + env(safe-area-inset-top, 0px)))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
            }}
            initial={reduce ? false : { x: drawerXClosed }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: drawerXClosed }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            aria-label="قائمة الجوال"
          >
            <div className="shrink-0 border-b border-sage-100/90 pb-5 text-start">
              <p className="font-display text-2xl font-semibold tracking-tight text-moss-900">Healthy Mama</p>
              <p className="mt-1 text-sm font-medium text-sage-600">نوال عمر</p>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              {[
                ["كيف يعمل", "/#how-it-works"],
                ["نصائح مفيدة", "/#wellness-tips"],
                ["الاستبيانات", "/#quiz-section"],
                ["الكتب", "/#quiz-results"],
                ...(user
                  ? [
                      ["لوحة الحساب", "/dashboard"],
                      ["مكتبتي", "/library"],
                    ]
                  : []),
                ["التواصل", "/#contact"],
              ].map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-xl px-3 py-4 text-lg font-medium text-sage-800 transition-colors hover:bg-sage-100/80"
                  onClick={close}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="shrink-0 flex flex-col gap-3 border-t border-sage-100 pt-6">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    void logout();
                    close();
                  }}
                  className="w-full rounded-pill border border-sage-200 bg-white px-4 py-3 text-sm font-semibold text-sage-700"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handleSignIn();
                    close();
                  }}
                  disabled={!isFirebaseConfigured}
                  className="w-full rounded-pill border border-sage-200 bg-white px-4 py-3 text-sm font-semibold text-sage-700"
                >
                  تسجيل الدخول
                </button>
              )}
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnPrimary} w-full text-center`}
                onClick={close}
              >
                واتساب
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
