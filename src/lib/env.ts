export function getWhatsappUrl(): string {
  return import.meta.env.VITE_WHATSAPP_URL ?? "https://wa.me/972501234567";
}

export function getInstagramUrl(): string {
  return import.meta.env.VITE_INSTAGRAM_URL ?? "https://instagram.com";
}

export function getPaypalBusiness(): string {
  return import.meta.env.VITE_PAYPAL_BUSINESS ?? "your-email@example.com";
}

export function getPaypalEnv(): "live" | "sandbox" {
  const v = (import.meta.env.VITE_PAYPAL_ENV ?? "live").toLowerCase();
  return v === "sandbox" ? "sandbox" : "live";
}

export function getPaypalNotifyUrl(): string | undefined {
  const value = import.meta.env.VITE_PAYPAL_NOTIFY_URL;
  return value && value.length > 0 ? value : undefined;
}

export function getDiscountCode(): string | undefined {
  const value = import.meta.env.VITE_DISCOUNT_CODE;
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function getDiscountPercent(): number {
  const raw = Number(import.meta.env.VITE_DISCOUNT_PERCENT ?? "0");
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, raw));
}

export function isPromoEnabled(): boolean {
  return (import.meta.env.VITE_ENABLE_PROMO ?? "").toLowerCase() === "true";
}

export function getPromoRedeemUrl(): string | undefined {
  const value = import.meta.env.VITE_PROMO_REDEEM_URL;
  return value && value.length > 0 ? value : undefined;
}

export function getAdminPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? "healthy2025";
}

export function getContactFormAction(): string | undefined {
  const a = import.meta.env.VITE_CONTACT_FORM_ACTION;
  return a && a.length > 0 ? a : undefined;
}

export function getAppUrl(): string {
  return import.meta.env.VITE_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
}

export function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}
