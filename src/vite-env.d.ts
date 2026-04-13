/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_PAYPAL_BUSINESS?: string;
  readonly VITE_PAYPAL_ENV?: string;
  readonly VITE_PAYPAL_NOTIFY_URL?: string;
  readonly VITE_DISCOUNT_CODE?: string;
  readonly VITE_DISCOUNT_PERCENT?: string;
  readonly VITE_PROMO_REDEEM_URL?: string;
  readonly VITE_ENABLE_PROMO?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly VITE_CONTACT_FORM_ACTION?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
