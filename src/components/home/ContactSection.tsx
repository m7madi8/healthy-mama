import { motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getContactFormAction, getWhatsappUrl } from "../../lib/env";
import { MotionFade } from "../ui/MotionFade";
import { btnSecondary } from "../ui/PrimaryButton";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const action = getContactFormAction();
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const message = String(fd.get("message") ?? "");

    if (action) {
      setPending(true);
      try {
        const body = new FormData();
        body.append("name", name);
        body.append("email", email);
        body.append("message", message);
        const res = await fetch(action, {
          method: "POST",
          body,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("submit failed");
      } catch {
        setPending(false);
        return;
      }
      setPending(false);
    }

    setSubmitted(true);
    form.reset();
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionFade variant="fade-down">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sage-500">التواصل</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
              نحن بجانبك
            </h2>
            <p className="mt-4 max-w-md text-sage-700">
              استفسار عن كتاب أو استبيان أو طلب؟ أرسلي رسالة — أو تواصلي عبر واتساب للرد الأسرع.
            </p>
            <motion.a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnSecondary} mt-8 w-full max-w-xs sm:w-auto`}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              فتح واتساب
            </motion.a>
          </MotionFade>

          <MotionFade delay={0.12} variant="gentle-zoom">
            {!submitted ? (
              <form
                onSubmit={onSubmit}
                noValidate
                className="rounded-3xl border border-sage-100 bg-white/90 p-8 shadow-soft backdrop-blur-sm"
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-sage-800">
                      الاسم الكامل
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={pending}
                      className="mt-1.5 w-full rounded-xl border border-sage-200 bg-milk/50 px-4 py-3 text-sage-900 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-sm font-medium text-sage-800">
                      البريد الإلكتروني
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={pending}
                      className="mt-1.5 w-full rounded-xl border border-sage-200 bg-milk/50 px-4 py-3 text-sage-900 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-sm font-medium text-sage-800">
                      الرسالة
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      disabled={pending}
                      className="mt-1.5 w-full resize-none rounded-xl border border-sage-200 bg-milk/50 px-4 py-3 text-sage-900 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-pill bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-sage-500 disabled:opacity-60"
                  >
                    {pending ? "جاري الإرسال…" : "أرسلي الرسالة"}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="rounded-3xl border border-sage-100 bg-sage-50/80 p-8 text-center shadow-soft"
                role="status"
                aria-live="polite"
              >
                <p className="font-display text-xl font-semibold text-moss-900">شكرًا لتواصلك معنا</p>
                <p className="mt-2 text-sm text-sage-700">نقرأ كل رسالة ونرد عليكِ في أقرب وقت.</p>
                <p className="mt-6 text-sm text-sage-600">
                  قد يعجبك أيضًا:{" "}
                  <span className="font-medium text-sage-800">«رحلة الحمل: ماذا يحدث في جسمك شهرًا بعد شهر»</span>
                </p>
                <Link
                  to="/books/book-pregnancy"
                  className="mt-4 inline-block text-sm font-semibold text-sage-600 underline-offset-2 hover:text-sage-800 hover:underline"
                >
                  عرض هذا الكتاب
                </Link>
              </div>
            )}
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
