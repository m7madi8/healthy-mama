import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { ProfileAvatarPlaceholder } from "../components/ui/ProfileAvatarPlaceholder";
import { scrollTransition, scrollViewport } from "../components/ui/motionPresets";
import { useAuth } from "../hooks/useAuth";
import { usePurchasedBooks } from "../hooks/usePurchasedBooks";
import { getWhatsappUrl } from "../lib/env";

const previewLimit = 6;

export function DashboardPage() {
  const { profile, user, logout } = useAuth();
  const { books, loading } = usePurchasedBooks(user?.uid);
  const reduce = useReducedMotion();
  const displayName = profile?.name || user?.displayName || "زائرة";
  const email = profile?.email || user?.email || "";
  const count = books.length;
  const preview = books.slice(0, previewLimit);

  return (
    <>
      <Seo title="لوحة الحساب — Healthy Mama" />
      <main
        className="min-h-screen bg-gradient-to-b from-milk via-white to-mist/40 px-4 pb-24 pt-28 sm:px-6"
        id="main"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex flex-wrap items-center justify-between gap-4"
          >
            <Link
              to="/"
              className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-900"
            >
              ← العودة للرئيسية
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full border border-sage-200/90 bg-white/80 px-4 py-2 text-sm font-semibold text-sage-700 shadow-soft backdrop-blur-sm transition-all hover:border-sage-300 hover:bg-white"
            >
              تسجيل الخروج
            </button>
          </motion.div>

          <motion.section
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] border border-sage-100/90 bg-gradient-to-br from-white via-white to-sage-50/40 p-8 shadow-lift ring-1 ring-sage-100/50 md:p-10"
          >
            <div
              className="pointer-events-none absolute -start-24 -top-24 h-64 w-64 rounded-full bg-sage-200/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-mist/80 blur-2xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-[1.75rem] border border-white object-cover shadow-soft ring-2 ring-sage-100/80"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] border border-sage-100 bg-white shadow-soft ring-2 ring-sage-100/80">
                    <ProfileAvatarPlaceholder />
                  </div>
                )}
                <div className="text-center sm:text-start">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-500">
                    حسابي
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-moss-900 md:text-4xl">
                    أهلاً، {displayName}
                  </h1>
                  {email ? (
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-sage-600">{email}</p>
                  ) : null}
                  <p className="mt-3 text-sm text-sage-500">
                    من هنا تديرين مكتبتك الرقمية وتكملين القراءة بسهولة.
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px]">
                <Link
                  to="/library"
                  className="inline-flex items-center justify-center rounded-pill bg-sage-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-sage-500 hover:shadow-[0_16px_48px_rgba(74,107,78,0.22)]"
                >
                  مكتبتي الكاملة
                </Link>
                <Link
                  to="/#quiz-results"
                  className="inline-flex items-center justify-center rounded-pill border border-sage-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-sage-800 shadow-soft backdrop-blur-sm transition-all hover:border-sage-300 hover:bg-white"
                >
                  اكتشفي المزيد من الكتب
                </Link>
              </div>
            </div>
          </motion.section>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "كتب في مكتبتك",
                value: loading ? "…" : String(count),
                hint: count === 1 ? "دليل واحد جاهز للقراءة" : "أدلة رقمية تملكينها",
              },
              {
                label: "القراءة",
                value: count > 0 ? "مفعّلة" : "—",
                hint: count > 0 ? "افتحي أي كتاب من الأسفل" : "ابدئي بشراء أو تفعيل كتاب",
              },
              {
                label: "هل تحتاجين مساعدة؟",
                value: "تواصل",
                hint: "فريق Healthy Mama",
                href: getWhatsappUrl(),
                external: true,
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ ...scrollTransition, delay: reduce ? 0 : i * 0.06 }}
                className="rounded-2xl border border-sage-100/90 bg-white/85 p-6 shadow-soft backdrop-blur-sm"
              >
                {card.external && card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-opacity hover:opacity-90"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
                      {card.label}
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-moss-900">{card.value}</p>
                    <p className="mt-2 text-sm text-sage-600">{card.hint}</p>
                  </a>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
                      {card.label}
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-moss-900">{card.value}</p>
                    <p className="mt-2 text-sm text-sage-600">{card.hint}</p>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          <motion.section
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={scrollTransition}
            className="mt-14"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-2xl font-semibold text-moss-900">كتبي</h2>
                <p className="mt-1 text-sm text-sage-600">
                  معاينة سريعة — كل كتبكِ في صفحة المكتبة.
                </p>
              </div>
              {count > previewLimit ? (
                <Link
                  to="/library"
                  className="text-sm font-semibold text-sage-600 underline-offset-4 hover:text-sage-900 hover:underline"
                >
                  عرض الكل ({count})
                </Link>
              ) : null}
            </div>

            {loading ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    className="h-40 animate-pulse rounded-2xl border border-sage-100 bg-sage-50/80"
                  />
                ))}
              </div>
            ) : preview.length === 0 ? (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-sage-200 bg-white/70 px-8 py-14 text-center shadow-soft">
                <p className="font-display text-lg font-semibold text-moss-900">مكتبتك فارغة حتى الآن</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-sage-600">
                  اختاري دليلاً يناسبكِ من صفحة الكتب، أو فعّلي كود الخصم إن كان متاحًا.
                </p>
                <Link
                  to="/#quiz-results"
                  className="mt-8 inline-flex rounded-pill bg-sage-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-sage-500"
                >
                  تصفحي الكتب
                </Link>
              </div>
            ) : (
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map((book, index) => (
                  <motion.li
                    key={book.id}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={scrollViewport}
                    transition={{ ...scrollTransition, delay: reduce ? 0 : index * 0.05 }}
                  >
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage-100/90 bg-white shadow-soft transition-all duration-300 hover:border-sage-200/90 hover:shadow-lift">
                      <div className="relative aspect-[4/3] overflow-hidden bg-petal">
                        <img
                          src={book.coverSrc}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-display text-base font-semibold leading-snug text-moss-900">
                          {book.shortTitle}
                        </h3>
                        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-sage-600">
                          {book.cardDescription}
                        </p>
                        <Link
                          to={`/reader/${book.id}`}
                          className="mt-4 inline-flex items-center justify-center rounded-pill bg-sage-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-sage-500"
                        >
                          متابعة القراءة
                        </Link>
                      </div>
                    </article>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.section>

          <motion.footer
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={scrollViewport}
            transition={{ duration: 0.45 }}
            className="mt-16 rounded-2xl border border-sage-100 bg-white/60 px-6 py-5 text-center text-xs text-sage-500 backdrop-blur-sm"
          >
            الحساب مرتبط بتسجيل الدخول عبر Google. لأي استفسار عن الطلبات أو المحتوى، راسلينا على واتساب من
            الصفحة الرئيسية.
          </motion.footer>
        </div>
      </main>
    </>
  );
}
