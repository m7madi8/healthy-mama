import { httpsCallable, type HttpsCallableResult } from "firebase/functions";
import { getFirebaseFunctions } from "./firebase";

export type OwnerDashboardBookStat = {
  bookId: string;
  purchaseCount: number;
  /** عدد مستندات المكتبة بحالة paid (يشمل التفعيل المجاني بدون طلب في orders) */
  libraryActivations: number;
  revenue: number;
};

export type OwnerDashboardOrderRow = {
  id: string;
  uid: string;
  bookId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: number | null;
};

export type OwnerDashboardData = {
  generatedAt: number;
  registeredUsers: number;
  uniqueBuyers: number;
  paidOrdersCount: number;
  totalRevenue: number;
  libraryHolders: number;
  totalLibraryItems: number;
  libraryQueryOk: boolean;
  pageViewsTotal: number;
  bookStats: OwnerDashboardBookStat[];
  recentOrders: OwnerDashboardOrderRow[];
  providersBreakdown: { provider: string; count: number }[];
};

const PV_SESSION_KEY = "hm_pv_recorded";

let pageViewInflight = false;

/** One increment per browser tab session; safe under React StrictMode (single in-flight guard). */
export async function recordPageViewOncePerSession(): Promise<void> {
  if (typeof window === "undefined" || sessionStorage.getItem(PV_SESSION_KEY) || pageViewInflight) return;
  pageViewInflight = true;
  try {
    await httpsCallable(getFirebaseFunctions(), "recordPageView")();
    sessionStorage.setItem(PV_SESSION_KEY, "1");
  } catch {
    /* Functions may be undeployed locally — retry on next navigation */
  } finally {
    pageViewInflight = false;
  }
}

function normalizeDashboardPayload(raw: unknown): OwnerDashboardData {
  if (!raw || typeof raw !== "object") {
    throw new Error("استجابة غير صالحة من الخادم.");
  }
  const o = raw as Record<string, unknown>;
  const bookStats = Array.isArray(o.bookStats) ? o.bookStats : [];
  const recentOrders = Array.isArray(o.recentOrders) ? o.recentOrders : [];
  const providersBreakdown = Array.isArray(o.providersBreakdown) ? o.providersBreakdown : [];

  return {
    generatedAt: Number(o.generatedAt) || Date.now(),
    registeredUsers: Number(o.registeredUsers) || 0,
    uniqueBuyers: Number(o.uniqueBuyers) || 0,
    paidOrdersCount: Number(o.paidOrdersCount) || 0,
    totalRevenue: Number(o.totalRevenue) || 0,
    libraryHolders: Number(o.libraryHolders) || 0,
    totalLibraryItems: Number(o.totalLibraryItems) || 0,
    libraryQueryOk: Boolean(o.libraryQueryOk),
    pageViewsTotal: Number(o.pageViewsTotal) || 0,
    bookStats: bookStats.map((b) => {
      const x = b as Record<string, unknown>;
      return {
        bookId: String(x.bookId ?? ""),
        purchaseCount: Number(x.purchaseCount) || 0,
        libraryActivations: Number(x.libraryActivations) || 0,
        revenue: Number(x.revenue) || 0,
      };
    }),
    recentOrders: recentOrders.map((r) => {
      const x = r as Record<string, unknown>;
      const createdAt = x.createdAt;
      return {
        id: String(x.id ?? ""),
        uid: String(x.uid ?? ""),
        bookId: String(x.bookId ?? ""),
        amount: Number(x.amount) || 0,
        currency: String(x.currency ?? ""),
        status: String(x.status ?? ""),
        provider: String(x.provider ?? ""),
        createdAt:
          typeof createdAt === "number" && Number.isFinite(createdAt)
            ? createdAt
            : createdAt != null && typeof createdAt === "object" && "toMillis" in (createdAt as object)
              ? (createdAt as { toMillis: () => number }).toMillis()
              : null,
      };
    }),
    providersBreakdown: providersBreakdown.map((p) => {
      const x = p as Record<string, unknown>;
      return { provider: String(x.provider ?? ""), count: Number(x.count) || 0 };
    }),
  };
}

export async function fetchOwnerDashboard(): Promise<OwnerDashboardData> {
  const fn = httpsCallable<unknown, unknown>(getFirebaseFunctions(), "getOwnerDashboard");
  const res: HttpsCallableResult<unknown> = await fn();
  return normalizeDashboardPayload(res.data);
}
