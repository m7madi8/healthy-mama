import { auth } from "./firebase";
import { getPromoRedeemUrl } from "./env";

type RedeemResponse = {
  ok: boolean;
  message?: string;
};

export async function redeemPromoCode(bookId: string, code: string): Promise<RedeemResponse> {
  const endpoint = getPromoRedeemUrl();
  const user = auth.currentUser;

  if (!endpoint) {
    return { ok: false, message: "رابط تفعيل الكود غير مضبوط في الإعدادات." };
  }

  if (!user) {
    return { ok: false, message: "سجّلي الدخول أولًا." };
  }

  let response: Response;
  try {
    const token = await user.getIdToken();
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, code }),
    });
  } catch {
    return { ok: false, message: "تعذر الاتصال بخدمة التفعيل. تأكدي من نشر الدالة وإعداد الرابط الصحيح." };
  }

  let payload: RedeemResponse | null = null;
  try {
    payload = (await response.json()) as RedeemResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return { ok: false, message: payload?.message ?? "تعذر تفعيل الكود." };
  }

  return { ok: true, message: payload?.message ?? "تم تفعيل الكود بنجاح." };
}
