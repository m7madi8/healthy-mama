export function getAuthErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";

  switch (code) {
    case "auth/popup-blocked":
      return "المتصفح منع نافذة Google. سيتم تحويلك لتسجيل الدخول في نفس الصفحة.";
    case "auth/popup-closed-by-user":
      return "أُغلقت نافذة تسجيل الدخول. جرّبي مرة أخرى.";
    case "auth/cancelled-popup-request":
      return "طلب تسجيل الدخول أُلغي. انتظري لحظة ثم جرّبي مجددًا.";
    case "auth/network-request-failed":
      return "مشكلة في الاتصال. تحققي من الإنترنت وحاولي مرة أخرى.";
    case "auth/unauthorized-domain":
      return "نطاق الموقع غير مسموح في Firebase. أضيفيه في Authentication → Authorized domains.";
    case "auth/operation-not-allowed":
      return "تسجيل الدخول بـ Google غير مفعّل في Firebase Console.";
    default:
      return error instanceof Error ? error.message : "تعذر تسجيل الدخول. حاولي مرة أخرى.";
  }
}

export function shouldUseRedirectSignIn(error: unknown): boolean {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
  return code === "auth/popup-blocked";
}
