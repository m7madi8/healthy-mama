import type { Book } from "../../data/books";
import { getAppUrl } from "../../lib/env";
import { buildPaypalFields, getPaypalFormAction, isPaypalConfigured } from "../../lib/paypal";

type PayPalCheckoutProps = {
  book: Book;
  uid: string;
  amount: number;
};

export function PayPalCheckout({ book, uid, amount }: PayPalCheckoutProps) {
  const configured = isPaypalConfigured();
  const action = getPaypalFormAction();
  const origin = getAppUrl();
  const returnUrl = `${origin}/thank-you?book=${encodeURIComponent(book.id)}`;
  const cancelUrl = typeof window !== "undefined" ? window.location.href : "";

  const fields = buildPaypalFields({
    bookId: book.id,
    bookTitle: book.paypalItemTitle,
    amount: amount.toFixed(2),
    returnUrl,
    cancelUrl,
    custom: `${uid}|${book.id}`,
  });

  if (!configured) {
    return (
      <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-900">
        لتفعيل الدفع، أضيفي <code className="rounded bg-white/80 px-1">VITE_PAYPAL_BUSINESS</code> في ملف{" "}
        <code className="rounded bg-white/80 px-1">.env</code>.
      </p>
    );
  }

  return (
    <form method="post" action={action} id="paypal-checkout-form" className="w-full">
      {fields.map((f) => (
        <input key={f.name} type="hidden" name={f.name} value={f.value} />
      ))}
      <button
        type="submit"
        className="w-full rounded-pill bg-sage-600 py-4 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-sage-500"
      >
        ادفعي عبر PayPal أو البطاقة — {amount} ₪
      </button>
    </form>
  );
}
