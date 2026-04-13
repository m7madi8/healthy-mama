import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PayPalCheckout } from "../components/book/PayPalCheckout";
import { Seo } from "../components/layout/Seo";
import { useAuth } from "../hooks/useAuth";
import { getDiscountCode, getDiscountPercent } from "../lib/env";
import { claimFreeBookWithCode } from "../lib/firestore";
import { LinkButton } from "../components/ui/PrimaryButton";
import { scrollTransition, scrollViewport } from "../components/ui/motionPresets";
import { getBookBySlug } from "../data/books";

export function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const book = getBookBySlug(slug);
  const { user, signInWithGoogle } = useAuth();
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountFeedback, setDiscountFeedback] = useState<string | null>(null);
  const [freeClaimLoading, setFreeClaimLoading] = useState(false);
  const [freeClaimFeedback, setFreeClaimFeedback] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const discountCode = getDiscountCode();
  const discountPercent = getDiscountPercent();
  const hasDiscountConfig = Boolean(discountCode && discountPercent > 0);

  if (!book) {
    return <Navigate to="/" replace />;
  }

  const finalPrice = useMemo(() => {
    if (!discountApplied) return book.price;
    const discounted = book.price - (book.price * discountPercent) / 100;
    return Number(discounted.toFixed(2));
  }, [book.price, discountApplied, discountPercent]);
  const isFreeByDiscount = discountApplied && finalPrice <= 0;

  const handleApplyDiscountCode = () => {
    void (async () => {
      if (!discountCodeInput.trim()) {
        setDiscountFeedback("أدخلي كود الخصم أولًا.");
        return;
      }

      if (!hasDiscountConfig) {
        setDiscountFeedback("ميزة كود الخصم غير مفعلة حاليًا.");
        return;
      }

      if (discountCodeInput.trim().toLowerCase() !== discountCode?.toLowerCase()) {
        setDiscountApplied(false);
        setDiscountFeedback("كود الخصم غير صحيح.");
        return;
      }

      setDiscountApplied(true);
      setDiscountFeedback(`تم تطبيق خصم ${discountPercent}% بنجاح.`);
      setFreeClaimFeedback(null);

      // خصم 100%: إضافة الكتاب للمكتبة مباشرة بعد التطبيق (لا يعتمد على زر ثانٍ)
      if (user && discountPercent === 100) {
        setFreeClaimLoading(true);
        const result = await claimFreeBookWithCode(user.uid, book.id, discountCodeInput.trim());
        if (result.ok) {
          setFreeClaimFeedback("تمت إضافة الكتاب إلى مكتبتك.");
          navigate("/library", { replace: true });
        } else {
          setFreeClaimFeedback(result.message);
        }
        setFreeClaimLoading(false);
      }
    })();
  };

  const handleFreeClaim = async () => {
    if (!isFreeByDiscount || !user) return;
    setFreeClaimLoading(true);
    const result = await claimFreeBookWithCode(user.uid, book.id, discountCodeInput.trim());
    setFreeClaimFeedback(result.ok ? "تمت إضافة الكتاب إلى مكتبتك." : result.message);
    setFreeClaimLoading(false);
  };

  return (
    <>
      <Seo title={book.documentTitle} />
      <main className="min-h-screen bg-milk pb-20 pt-24" id="main">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            to="/#quiz-results"
            className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
          >
            ← كل الأدلة
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <motion.div
              className="relative mx-auto max-w-md lg:mx-0"
              initial={reduce ? false : { opacity: 0, y: 26, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={scrollViewport}
              transition={reduce ? { duration: 0 } : { ...scrollTransition }}
            >
              <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-petal shadow-lift ring-1 ring-sage-100/60">
                <img
                  src={book.coverSrc}
                  alt=""
                  className="w-full object-cover"
                  width={400}
                  height={560}
                />
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={reduce ? { duration: 0 } : { ...scrollTransition, delay: 0.1 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-500">دليل رقمي</p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
                {book.title}
              </h1>
              <p className="mt-6 leading-relaxed text-sage-700">{book.description}</p>

              <ul className="mt-8 space-y-3">
                {book.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-sage-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                    {b}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm font-semibold text-sage-600">
                {finalPrice} ₪ · وصول فوري بعد الشراء
              </p>

              <div className="mt-6 rounded-2xl border border-sage-100 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
                {user ? (
                  <>
                    <p className="text-sm font-medium text-sage-700">دفع آمن عبر PayPal أو البطاقة</p>
                    {!isFreeByDiscount && (
                      <div className="mt-4">
                        <PayPalCheckout book={book} uid={user.uid} amount={finalPrice} />
                      </div>
                    )}
                    <div className="mt-4 rounded-xl border border-sage-100 bg-sage-50/60 p-4">
                      <p className="text-xs font-semibold text-sage-700">كود خصم</p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={discountCodeInput}
                          onChange={(event) => setDiscountCodeInput(event.target.value)}
                          className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm outline-none focus:border-sage-400"
                          placeholder="أدخلي كود الخصم ثم اضغطي تطبيق"
                        />
                        <button
                          type="button"
                          onClick={handleApplyDiscountCode}
                          className="rounded-pill bg-sage-700 px-5 py-2 text-sm font-semibold text-white"
                        >
                          تطبيق
                        </button>
                      </div>
                      {discountFeedback && <p className="mt-2 text-xs text-sage-700">{discountFeedback}</p>}
                      {isFreeByDiscount && (
                        <div className="mt-3 border-t border-sage-200 pt-3">
                          <button
                            type="button"
                            onClick={() => void handleFreeClaim()}
                            disabled={freeClaimLoading}
                            className="w-full rounded-pill bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-60"
                          >
                            {freeClaimLoading ? "جاري إضافة الكتاب..." : "الحصول على الكتاب مجانًا"}
                          </button>
                          {freeClaimFeedback && <p className="mt-2 text-xs text-sage-700">{freeClaimFeedback}</p>}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 text-center">
                    <p className="text-sm text-sage-700">سجّلي الدخول أولًا عبر Google لإضافة الكتاب إلى مكتبتك.</p>
                    <button
                      type="button"
                      onClick={() => void signInWithGoogle()}
                      className="w-full rounded-pill bg-sage-600 py-3 text-sm font-semibold text-white transition-all hover:bg-sage-500"
                    >
                      تسجيل الدخول عبر Google
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <LinkButton to="/quiz">أعيدي الاستبيان</LinkButton>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
