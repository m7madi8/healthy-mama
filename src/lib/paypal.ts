import { getPaypalBusiness, getPaypalEnv, getPaypalNotifyUrl } from "./env";

export type PayPalField = { name: string; value: string };

export function getPaypalFormAction(): string {
  return getPaypalEnv() === "sandbox"
    ? "https://www.sandbox.paypal.com/cgi-bin/webscr"
    : "https://www.paypal.com/cgi-bin/webscr";
}

export function buildPaypalFields(options: {
  bookId: string;
  bookTitle: string;
  amount: string;
  returnUrl: string;
  cancelUrl: string;
  custom: string;
}): PayPalField[] {
  const business = getPaypalBusiness();
  const notifyUrl = getPaypalNotifyUrl();
  return [
    { name: "cmd", value: "_xclick" },
    { name: "business", value: business },
    { name: "item_name", value: options.bookTitle },
    { name: "item_number", value: options.bookId },
    { name: "custom", value: options.custom },
    { name: "amount", value: options.amount },
    { name: "currency_code", value: "ILS" },
    { name: "return", value: options.returnUrl },
    { name: "cancel_return", value: options.cancelUrl },
    { name: "no_shipping", value: "1" },
    { name: "charset", value: "utf-8" },
    { name: "lc", value: "ar" },
    ...(notifyUrl ? [{ name: "notify_url", value: notifyUrl }] : []),
  ];
}

export function isPaypalConfigured(): boolean {
  const b = getPaypalBusiness();
  return Boolean(b && b !== "your-email@example.com");
}
