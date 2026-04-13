import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/layout/Seo";
import { Button } from "../components/ui/PrimaryButton";
import { ProfileAvatarPlaceholder } from "../components/ui/ProfileAvatarPlaceholder";
import { BOOKS } from "../data/books";
import { useAuth } from "../hooks/useAuth";
import { firebaseConfigError, isFirebaseConfigured } from "../lib/firebase";
import { fetchOwnerDashboard, type OwnerDashboardData } from "../lib/ownerDashboard";

type AdminTab = "overview" | "books" | "orders" | "traffic";

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("ar-EG", { maximumFractionDigits: 0 });
}

function formatWhen(ms: number | null): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  return new Date(ms).toLocaleString("ar-EG", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function providerLabel(p: string): string {
  if (p === "paypal") return "PayPal";
  if (p === "promo") return "كود تفعيل";
  return p;
}

function StatCard({
  label,
  value,
  hint,
  accent = "sage",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "sage" | "moss" | "warm";
}) {
  const ring =
    accent === "moss"
      ? "ring-moss-900/10"
      : accent === "warm"
        ? "ring-amber-200/40"
        : "ring-sage-200/50";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-sage-100/90 bg-white/95 p-5 shadow-soft ring-1 ${ring} backdrop-blur-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-moss-900">{value}</p>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-sage-600">{hint}</p> : null}
    </div>
  );
}

const navItems: { id: AdminTab; label: string; desc: string }[] = [
  { id: "overview", label: "نظرة عامة", desc: "ملخص سريع" },
  { id: "books", label: "الكتب والإيراد", desc: "حسب كل دليل" },
  { id: "orders", label: "الطلبات", desc: "آخر المعاملات" },
  { id: "traffic", label: "الزيارات والإعداد", desc: "عداد الزيارات وضبط المالك" },
];

export function AdminPage() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadErrorCode, setLoadErrorCode] = useState<string | null>(null);
  const [loadingDash, setLoadingDash] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoadingDash(true);
    setLoadError(null);
    setLoadErrorCode(null);
    try {
      const next = await fetchOwnerDashboard();
      setData(next);
    } catch (e: unknown) {
      const fe = e as { code?: string; message?: string };
      const code = typeof fe.code === "string" ? fe.code : "";
      const msg = typeof fe.message === "string" ? fe.message : "تعذر تحميل البيانات.";
      setLoadErrorCode(code || null);
      if (code === "functions/not-found") {
        setLoadError(
          "دالة getOwnerDashboard غير منشورة. نفّذي firebase deploy --only functions من مجلد المشروع.",
        );
      } else {
        setLoadError(msg);
      }
      setData(null);
    } finally {
      setLoadingDash(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const bookStatsMap = useMemo(() => {
    const m = new Map<string, { purchaseCount: number; libraryActivations: number; revenue: number }>();
    data?.bookStats?.forEach((b) =>
      m.set(b.bookId, {
        purchaseCount: b.purchaseCount,
        libraryActivations: b.libraryActivations ?? 0,
        revenue: b.revenue,
      }),
    );
    return m;
  }, [data]);

  const copyUid = useCallback(() => {
    if (!user?.uid) return;
    void navigator.clipboard.writeText(user.uid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [user?.uid]);

  const onGoogleSignIn = useCallback(async () => {
    setSignInError(null);
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "تعذر تسجيل الدخول.";
      setSignInError(msg);
    }
  }, [signInWithGoogle]);

  const closeMobile = useCallback(() => setMobileNav(false), []);

  if (!isFirebaseConfigured) {
    return (
      <>
        <Seo title="لوحة المالك — Healthy Mama" />
        <div className="flex min-h-screen items-center justify-center bg-milk px-4">
          <div className="max-w-md rounded-3xl border border-sage-200 bg-white p-8 text-center shadow-soft">
            <h1 className="font-display text-xl font-semibold text-moss-900">Firebase غير مضبوط</h1>
            <p className="mt-3 text-sm text-sage-600">{firebaseConfigError}</p>
            <Link to="/" className="mt-6 inline-block text-sm font-semibold text-sage-600 hover:text-sage-800">
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (authLoading) {
    return (
      <>
        <Seo title="لوحة المالك — Healthy Mama" />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-milk to-mist/30">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sage-200 border-t-sage-600" aria-hidden />
          <span className="sr-only">جاري التحميل…</span>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Seo title="تسجيل دخول المالك — Healthy Mama" />
        <div className="min-h-screen bg-gradient-to-b from-milk via-white to-sage-50/30 px-4 py-16">
          <div className="mx-auto max-w-md">
            <Link to="/" className="text-sm font-medium text-sage-600 hover:text-sage-900">
              ← العودة للرئيسية
            </Link>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 overflow-hidden rounded-[1.75rem] border border-sage-100/90 bg-white p-8 shadow-lift ring-1 ring-sage-100/40"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-500">لوحة المالك</p>
              <h1 className="mt-3 font-display text-2xl font-semibold text-moss-900">دخول آمن عبر Google</h1>
              <p className="mt-3 text-sm leading-relaxed text-sage-600">
                تظهر الأرقام الحقيقية من Firestore وFirebase Auth. يجب أن يكون معرّف حسابك مضافًا إلى{" "}
                <code className="rounded bg-sage-50 px-1.5 py-0.5 text-xs text-sage-800">ADMIN_UIDS</code> في
                بيئة Cloud Functions.
              </p>
              {signInError ? (
                <p className="mt-4 rounded-xl border border-red-100 bg-red-50/90 px-3 py-2 text-sm text-red-800">
                  {signInError}
                </p>
              ) : null}
              <div className="mt-8">
                <Button type="button" onClick={() => void onGoogleSignIn()} className="w-full justify-center">
                  المتابعة بحساب Google
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  const isDenied =
    loadErrorCode === "functions/permission-denied" || loadErrorCode === "permission-denied";
  const isPrecondition =
    loadErrorCode === "functions/failed-precondition" || loadErrorCode === "failed-precondition";

  if (loadError && (isDenied || isPrecondition)) {
    return (
      <>
        <Seo title="لوحة المالك — صلاحية" />
        <div className="min-h-screen bg-gradient-to-b from-milk to-mist/40 px-4 py-16">
          <div className="mx-auto max-w-lg">
            <Link to="/" className="text-sm font-medium text-sage-600 hover:text-sage-900">
              ← العودة للرئيسية
            </Link>
            <div className="mt-8 rounded-[1.75rem] border border-amber-200/80 bg-white p-8 shadow-soft">
              <h1 className="font-display text-xl font-semibold text-moss-900">
                {isPrecondition ? "ضبط بيئة المالك" : "لا تملكين صلاحية الوصول"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-sage-700">{loadError}</p>
              <div className="mt-6 rounded-2xl border border-sage-100 bg-sage-50/80 p-4">
                <p className="text-xs font-semibold text-sage-600">معرّف حسابك (للنسخ إلى ADMIN_UIDS)</p>
                <p className="mt-2 break-all font-mono text-sm text-moss-900">{user.uid}</p>
                <button
                  type="button"
                  onClick={copyUid}
                  className="mt-3 rounded-pill border border-sage-200 bg-white px-4 py-2 text-xs font-semibold text-sage-800 shadow-sm hover:bg-sage-50"
                >
                  {copied ? "تم النسخ" : "نسخ المعرّف"}
                </button>
              </div>
              <p className="mt-4 text-xs text-sage-500">
                أنشئي ملف <code className="rounded bg-white px-1">functions/.env</code> يحتوي{" "}
                <code className="rounded bg-white px-1">ADMIN_UIDS=…</code> ثم أعيدي نشر الدوال. راجعي{" "}
                <code className="rounded bg-white px-1">.env.example</code>.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-pill border border-sage-200 px-5 py-2.5 text-sm font-semibold text-sage-800 hover:bg-white"
                >
                  تسجيل الخروج
                </button>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="rounded-pill bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-sage-500"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const NavBlock = ({ onPick }: { onPick?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-sage-100/80 p-6">
        <p className="font-display text-lg font-semibold text-moss-900">Healthy Mama</p>
        <p className="text-xs font-medium text-sage-500">لوحة المالك</p>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="أقسام لوحة المالك">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              onPick?.();
            }}
            className={
              "flex w-full flex-col items-start rounded-xl px-4 py-3 text-start transition-colors " +
              (tab === item.id
                ? "bg-sage-100/90 text-moss-900 shadow-sm"
                : "text-sage-700 hover:bg-sage-50/80")
            }
          >
            <span className="text-sm font-semibold">{item.label}</span>
            <span className="text-xs text-sage-500">{item.desc}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-sage-100/80 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-sage-100 bg-white/80 px-3 py-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-sage-100" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sage-100 bg-white" aria-hidden>
              <ProfileAvatarPlaceholder className="scale-[0.65] text-sage-500" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-moss-900">{user.displayName || "مالك"}</p>
            <p className="truncate text-[11px] text-sage-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-center text-sm font-medium text-sage-600 hover:bg-sage-50"
            onClick={onPick}
          >
            ← الموقع العام
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-sage-600 hover:bg-sage-50"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Seo title="لوحة المالك — Healthy Mama" />
      <div className="min-h-screen bg-gradient-to-b from-milk via-white to-mist/35 text-moss-900">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-sage-100/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-sage-800 shadow-sm"
            onClick={() => setMobileNav(true)}
            aria-expanded={mobileNav}
            aria-controls="admin-mobile-drawer"
          >
            القائمة
          </button>
          <span className="font-display text-sm font-semibold text-moss-900">لوحة المالك</span>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl border border-sage-200 bg-white px-3 py-2 text-xs font-semibold text-sage-700"
            disabled={loadingDash}
          >
            تحديث
          </button>
        </header>

        <AnimatePresence>
          {mobileNav ? (
            <>
              <motion.button
                type="button"
                aria-label="إغلاق القائمة"
                className="fixed inset-0 z-40 bg-moss-900/35 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
              />
              <motion.aside
                id="admin-mobile-drawer"
                role="dialog"
                aria-modal="true"
                className="fixed inset-y-0 start-0 z-50 w-[min(20rem,88vw)] border-e border-sage-100 bg-white shadow-lift lg:hidden"
                initial={reduce ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={reduce ? undefined : { x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
              >
                <NavBlock onPick={closeMobile} />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <aside className="fixed inset-y-0 start-0 z-20 hidden w-64 border-e border-sage-100/90 bg-white/95 backdrop-blur-md lg:block">
          <NavBlock />
        </aside>

        <div className="lg:ps-64">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mt-0">
              <div>
                <h1 className="font-display text-xl font-semibold tracking-tight text-moss-900 sm:text-2xl md:text-3xl">
                  {navItems.find((n) => n.id === tab)?.label}
                </h1>
                <p className="mt-1 text-sm text-sage-600">{navItems.find((n) => n.id === tab)?.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => void load()}
                disabled={loadingDash}
                className="hidden shrink-0 rounded-pill border border-sage-200 bg-white px-5 py-2.5 text-sm font-semibold text-sage-800 shadow-soft transition-all hover:border-sage-300 disabled:opacity-60 sm:inline-flex"
              >
                {loadingDash ? "جاري التحديث…" : "تحديث البيانات"}
              </button>
            </div>

            {loadError && !isDenied && !isPrecondition ? (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-900">
                {loadError}
              </div>
            ) : null}

            {loadingDash && !data ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-sage-100/60" />
                ))}
              </div>
            ) : null}

            {!loadingDash && !data && loadError && !isDenied && !isPrecondition ? (
              <div className="mt-10 rounded-2xl border border-sage-200 bg-white p-8 text-center shadow-soft">
                <p className="font-medium text-moss-900">لم يُحمَّل ملخص لوحة المالك</p>
                <p className="mt-2 text-sm text-sage-600">تحققي من نشر الدوال ومن إقليم VITE_FIREBASE_FUNCTIONS_REGION.</p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="mt-6 rounded-pill bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-sage-500"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : null}

            {data ? (
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className="mt-8 space-y-10"
              >
                {tab === "overview" ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <StatCard
                        label="حسابات مسجّلة"
                        value={formatMoney(data.registeredUsers)}
                        hint="عدد مستخدمي Firebase Auth"
                        accent="moss"
                      />
                      <StatCard
                        label="يملكون كتبًا (مكتبة)"
                        value={formatMoney(data.libraryHolders)}
                        hint={
                          data.libraryQueryOk
                            ? "مستخدمو لديهم على الأقل كتاب مدفوع/مفعّل"
                            : "تعذر جلب المجموعة — انشري فهارس Firestore"
                        }
                      />
                      <StatCard
                        label="مشترون (من الطلبات)"
                        value={formatMoney(data.uniqueBuyers)}
                        hint="مستخدمو ظهرت طلباتهم في orders"
                      />
                      <StatCard
                        label="زيارات الموقع (تقريبي)"
                        value={formatMoney(data.pageViewsTotal)}
                        hint="عدّاد جلسات من المتصفح — جلسة واحدة لكل تبويب"
                        accent="warm"
                      />
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <StatCard
                        label="إجمالي الإيرادات"
                        value={`${formatMoney(data.totalRevenue)} ₪`}
                        hint="مجموع مبالغ الطلبات بحالة paid"
                      />
                      <StatCard
                        label="طلبات مدفوعة"
                        value={formatMoney(data.paidOrdersCount)}
                        hint={`عناصر مكتبة مفعّلة: ${formatMoney(data.totalLibraryItems)}`}
                      />
                    </div>
                    {(data.providersBreakdown?.length ?? 0) > 0 ? (
                      <div className="rounded-2xl border border-sage-100 bg-white/90 p-6 shadow-soft">
                        <h2 className="font-display text-lg font-semibold text-moss-900">مصادر الطلبات</h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {data.providersBreakdown.map((p) => (
                            <li
                              key={p.provider}
                              className="rounded-pill border border-sage-200 bg-sage-50/80 px-4 py-2 text-sm text-sage-800"
                            >
                              {providerLabel(p.provider)}: <strong>{p.count}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {tab === "books" ? (
                  <div className="overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="min-w-[760px] w-full text-sm">
                        <thead>
                          <tr className="border-b border-sage-100 bg-sage-50/50 text-start">
                            <th className="px-4 py-3 font-semibold text-sage-700">الكتاب</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">السعر</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">طلبات (PayPal/برومو)</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">تفعيلات المكتبة</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">الإيراد</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">رابط</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BOOKS.map((b) => {
                            const st = bookStatsMap.get(b.id) ?? {
                              purchaseCount: 0,
                              libraryActivations: 0,
                              revenue: 0,
                            };
                            return (
                              <tr key={b.id} className="border-b border-sage-50 last:border-0">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={b.coverSrc}
                                      alt=""
                                      width={40}
                                      height={56}
                                      className="rounded-lg object-cover shadow-sm ring-1 ring-sage-100"
                                    />
                                    <span className="font-medium text-moss-900">{b.shortTitle || b.title}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 tabular-nums text-sage-700">{b.price} ₪</td>
                                <td className="px-4 py-4 tabular-nums font-semibold text-moss-900">
                                  {st.purchaseCount}
                                </td>
                                <td className="px-4 py-4 tabular-nums font-semibold text-sage-800">
                                  {st.libraryActivations}
                                </td>
                                <td className="px-4 py-4 tabular-nums text-sage-800">{formatMoney(st.revenue)} ₪</td>
                                <td className="px-4 py-4">
                                  <Link
                                    to={`/books/${b.slug}`}
                                    className="font-semibold text-sage-600 hover:text-sage-900"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    عرض
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="border-t border-sage-100 bg-sage-50/30 px-4 py-3 text-xs text-sage-600">
                      «تفعيلات المكتبة» تشمل التفعيل المجاني بكود الخصم (لا يُنشئ سجلًا في orders). «الطلبات» تعرض
                      PayPal والبرومو فقط. تعديل الكتالوج من `src/data/books.ts`.
                    </p>
                  </div>
                ) : null}

                {tab === "orders" ? (
                  <div className="overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="min-w-[720px] w-full text-sm">
                        <thead>
                          <tr className="border-b border-sage-100 bg-sage-50/50 text-start">
                            <th className="px-4 py-3 font-semibold text-sage-700">التاريخ</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">الكتاب</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">المبلغ</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">المصدر</th>
                            <th className="px-4 py-3 font-semibold text-sage-700">المستخدم</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentOrders.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-10 text-center text-sage-600">
                                لا توجد طلبات في orders بعد. التفعيلات المجانية تظهر في تبويب «الكتب والإيراد» ضمن
                                عمود تفعيلات المكتبة.
                              </td>
                            </tr>
                          ) : (
                            data.recentOrders.map((o) => {
                              const book = BOOKS.find((b) => b.id === o.bookId);
                              return (
                                <tr key={o.id} className="border-b border-sage-50 last:border-0">
                                  <td className="px-4 py-3 whitespace-nowrap text-sage-700">{formatWhen(o.createdAt)}</td>
                                  <td className="px-4 py-3 text-moss-900">
                                    {book ? book.shortTitle || book.title : o.bookId}
                                  </td>
                                  <td className="px-4 py-3 tabular-nums font-medium">
                                    {formatMoney(o.amount)} {o.currency || "₪"}
                                  </td>
                                  <td className="px-4 py-3 text-sage-700">{providerLabel(o.provider)}</td>
                                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-sage-600">
                                    {o.uid}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {tab === "traffic" ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-sage-100 bg-white p-6 shadow-soft">
                      <h2 className="font-display text-lg font-semibold text-moss-900">الزيارات</h2>
                      <p className="mt-2 text-sm leading-relaxed text-sage-600">
                        يُزاد العداد مرة واحدة لكل جلسة تبويب عند زيارة الموقع (استدعاء دالة{" "}
                        <code className="rounded bg-sage-50 px-1 text-xs">recordPageView</code>). العدد تقريبي وليس
                        بديلاً عن Google Analytics.
                      </p>
                      <p className="mt-4 font-display text-4xl font-semibold tabular-nums text-sage-600">
                        {formatMoney(data.pageViewsTotal)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-sage-100 bg-gradient-to-br from-sage-50/50 to-white p-6 shadow-soft">
                      <h2 className="font-display text-lg font-semibold text-moss-900">ضبط صلاحية المالك</h2>
                      <ol className="mt-4 list-decimal space-y-2 pe-5 text-sm text-sage-700">
                        <li>انسخي معرّف حساب Google من الرسالة السابقة أو من قسم الملف الشخصي أدناه.</li>
                        <li>
                          أضيفي إلى ملف <code className="rounded bg-white px-1">functions/.env</code> السطر:{" "}
                          <code className="rounded bg-white px-1">ADMIN_UIDS=المعرّف</code> (عدة معرّفات مفصولة بفاصلة).
                        </li>
                        <li>
                          انشري الدوال: <code className="rounded bg-white px-1">firebase deploy --only functions</code>
                        </li>
                        <li>
                          انشري فهارس Firestore إن طُلب منك:{" "}
                          <code className="rounded bg-white px-1">firebase deploy --only firestore:indexes</code>
                        </li>
                      </ol>
                      <p className="mt-4 text-xs text-sage-500">
                        توليد البيانات: {new Date(data.generatedAt).toLocaleString("ar-EG")}
                      </p>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
