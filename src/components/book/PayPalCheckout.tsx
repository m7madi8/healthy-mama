import type { Book } from "../../data/books";
import { trackEvent } from "../../lib/analytics";
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
        الدفع الإلكتروني غير متاح مؤقتًا. تواصلي معنا عبر واتساب لإتمام الطلب.
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
        className="min-h-12 w-full rounded-pill bg-ink py-4 text-lg font-semibold text-cream"
        onClick={() => trackEvent("click_buy", { book: book.id, via: "paypal" })}
      >
        ادفعي عبر PayPal أو البطاقة — {amount} ₪
      </button>
    </form>
  );
}
