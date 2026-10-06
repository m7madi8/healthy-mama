import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const AUTO_DISMISS_MS = 6000;
const DEBOUNCE_MS = 4000;

function welcomeName(displayName: string | null | undefined, profileName: string | undefined): string {
  const raw = profileName?.trim() || displayName?.trim() || "";
  if (!raw) return "زائرة";
  const first = raw.split(/\s+/)[0];
  return first || "زائرة";
}

function shouldDebounceWelcome(uid: string): boolean {
  const key = `welcome-login-${uid}`;
  const last = sessionStorage.getItem(key);
  const now = Date.now();
  if (last && now - Number(last) < DEBOUNCE_MS) return true;
  sessionStorage.setItem(key, String(now));
  return false;
}

export function WelcomeNotification() {
  const { user, profile, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const prevUserRef = useRef<typeof user | undefined>(undefined);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (loading) return;

    const prev = prevUserRef.current;
    const signedIn = user !== null;

    if (prev === null && signedIn && user) {
      if (!shouldDebounceWelcome(user.uid)) {
        const name = welcomeName(user.displayName, profile?.name);
        setMessage(`أهلاً بكِ، ${name}! سعداء بوجودكِ في Healthy Mama.`);
        setOpen(true);
      }
    }

    prevUserRef.current = user;
  }, [user, profile?.name, loading]);

  useEffect(() => {
    if (!open) return;

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => setOpen(false), AUTO_DISMISS_MS);

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [open]);

  const dismiss = () => setOpen(false);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[5.5rem] z-[200] flex justify-center px-4 sm:top-[5.75rem]"
      aria-live="polite"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            role="status"
            className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-sage-100 bg-white/95 px-4 py-3.5 shadow-lift backdrop-blur-xl"
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-50 text-lg"
              aria-hidden
            >
              ✨
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[0.95rem] font-semibold text-sage-800">مرحباً بكِ</p>
              <p className="mt-0.5 text-sm leading-relaxed text-sage-600">{message}</p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-sage-500 transition-colors hover:bg-sage-50 hover:text-sage-700"
              aria-label="إغلاق الإشعار"
            >
              إغلاق
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
