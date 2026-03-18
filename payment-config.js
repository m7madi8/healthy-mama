/**
 * إعدادات الدفع — تُستخدم إذا لم يكن env.js موجوداً (لم يُنشأ من .env).
 * للأمان: استخدم .env ثم شغّل node build-env.js لتوليد env.js.
 */
if (typeof window.PAYPAL_BUSINESS === "undefined") window.PAYPAL_BUSINESS = "your-email@example.com";
if (typeof window.PAYPAL_ENV === "undefined") window.PAYPAL_ENV = "live";
