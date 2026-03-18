/**
 * إعدادات لوحة التحكم — تُستخدم إذا لم يكن env.js موجوداً.
 * كلمة السر الافتراضية: healthy2025 (غيّريها عبر ADMIN_PASSWORD في .env).
 */
if (typeof window.ADMIN_PASSWORD === "undefined") window.ADMIN_PASSWORD = "healthy2025";
