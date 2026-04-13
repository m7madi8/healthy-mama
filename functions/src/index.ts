import * as admin from "firebase-admin";
import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();
const PROMO_CODES = (process.env.PROMO_CODES ?? "")
  .split(",")
  .map((code) => code.trim())
  .filter(Boolean);

async function getUidFromAuthHeader(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length);
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded.uid;
}

function parseAdminUids(): string[] {
  return (process.env.ADMIN_UIDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function assertOwner(uid: string | undefined): void {
  if (!uid) {
    throw new HttpsError("unauthenticated", "سجّلي الدخول بحساب المالك.");
  }
  const allowed = parseAdminUids();
  if (allowed.length === 0) {
    logger.error("ADMIN_UIDS is empty — set env on Cloud Functions before using the owner dashboard.");
    throw new HttpsError(
      "failed-precondition",
      "لم يُضبط ADMIN_UIDS في بيئة Cloud Functions. راجعي التوثيق في .env.example.",
    );
  }
  if (!allowed.includes(uid)) {
    throw new HttpsError("permission-denied", "هذا الحساب غير مصرّح له بلوحة المالك.");
  }
}

function tsToMillis(v: unknown): number | null {
  if (v && typeof v === "object" && "toMillis" in v && typeof (v as { toMillis: () => number }).toMillis === "function") {
    return (v as { toMillis: () => number }).toMillis();
  }
  return null;
}

async function countRegisteredUsers(): Promise<number> {
  let total = 0;
  let pageToken: string | undefined;
  do {
    const res = await admin.auth().listUsers(1000, pageToken);
    total += res.users.length;
    pageToken = res.pageToken;
  } while (pageToken);
  return total;
}

async function verifyPaypalIpn(rawBody: Buffer): Promise<boolean> {
  const verifyBody = `cmd=_notify-validate&${rawBody.toString("utf8")}`;
  const response = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyBody,
  });
  const text = await response.text();
  return text === "VERIFIED";
}

export const paypalIpnWebhook = onRequest({ region: "us-central1" }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const verified = await verifyPaypalIpn(req.rawBody);
    if (!verified) {
      res.status(400).send("Invalid IPN");
      return;
    }

    const paymentStatus = String(req.body.payment_status ?? "");
    const txnId = String(req.body.txn_id ?? "");
    const custom = String(req.body.custom ?? "");
    const gross = Number(req.body.mc_gross ?? "0");
    const currency = String(req.body.mc_currency ?? "");
    const itemNumber = String(req.body.item_number ?? "");
    const receiverEmail = String(req.body.receiver_email ?? "");
    const [uid = "", bookId = ""] = custom.split("|");

    if (!txnId || !uid || !bookId || !itemNumber || paymentStatus !== "Completed") {
      res.status(200).send("Ignored");
      return;
    }

    const orderRef = db.collection("orders").doc(txnId);
    const libraryRef = db.collection("users").doc(uid).collection("library").doc(bookId);

    await db.runTransaction(async (transaction) => {
      const existingOrder = await transaction.get(orderRef);
      if (existingOrder.exists) return;

      transaction.set(orderRef, {
        uid,
        bookId,
        provider: "paypal",
        providerOrderId: txnId,
        status: "paid",
        amount: gross,
        currency,
        receiverEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.set(
        libraryRef,
        {
          bookId,
          orderId: txnId,
          status: "paid",
          purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("paypalIpnWebhook error", error);
    res.status(500).send("Server error");
  }
});

export const redeemPromoCode = onRequest({ region: "us-central1", cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method not allowed" });
    return;
  }

  try {
    const uid = await getUidFromAuthHeader(req.header("Authorization"));
    if (!uid) {
      res.status(401).json({ ok: false, message: "غير مصرح." });
      return;
    }

    const bookId = String(req.body?.bookId ?? "");
    const code = String(req.body?.code ?? "").trim();
    if (!bookId || !code) {
      res.status(400).json({ ok: false, message: "بيانات ناقصة." });
      return;
    }

    if (PROMO_CODES.length === 0) {
      res.status(500).json({ ok: false, message: "لم يتم إعداد أكواد التفعيل." });
      return;
    }

    if (!PROMO_CODES.includes(code)) {
      res.status(403).json({ ok: false, message: "الكود غير صحيح." });
      return;
    }

    const orderId = `promo-${uid}-${bookId}`;
    const orderRef = db.collection("orders").doc(orderId);
    const libraryRef = db.collection("users").doc(uid).collection("library").doc(bookId);

    await db.runTransaction(async (transaction) => {
      transaction.set(
        orderRef,
        {
          uid,
          bookId,
          provider: "promo",
          providerOrderId: orderId,
          status: "paid",
          amount: 0,
          currency: "ILS",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      transaction.set(
        libraryRef,
        {
          bookId,
          orderId,
          status: "paid",
          purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });

    res.status(200).json({ ok: true, message: "تم إضافة الكتاب إلى مكتبتك." });
  } catch (error) {
    console.error("redeemPromoCode error", error);
    res.status(500).json({ ok: false, message: "تعذر تفعيل الكود الآن." });
  }
});

/** invoker: public يسمح بـ OPTIONS (preflight) من المتصفح؛ المصادقة تبقى عبر Firebase داخل جسم Callable. */
const ownerFnOpts = {
  region: "us-central1" as const,
  timeoutSeconds: 120,
  memory: "512MiB" as const,
  cors: true,
  invoker: "public" as const,
};

/** Public lightweight counter for site visits (SPA session ping). */
export const recordPageView = onCall(ownerFnOpts, async () => {
  try {
    await db.doc("adminStats/summary").set(
      {
        pageViewsTotal: admin.firestore.FieldValue.increment(1),
        lastPageViewAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { ok: true as const };
  } catch (error) {
    logger.error("recordPageView error", error);
    throw new HttpsError("internal", "تعذر تسجيل الزيارة.");
  }
});

/** Aggregated metrics for the store owner (Firestore + Auth). */
export const getOwnerDashboard = onCall(ownerFnOpts, async (request) => {
  assertOwner(request.auth?.uid);

  try {
    const [registeredUsers, ordersSnap, librarySnap, statsSnap] = await Promise.all([
      countRegisteredUsers(),
      db.collection("orders").get(),
      db
        .collectionGroup("library")
        .where("status", "==", "paid")
        .get()
        .catch((err: unknown) => {
          logger.warn("library collectionGroup query failed", err);
          return null;
        }),
      db.doc("adminStats/summary").get(),
    ]);

    const uniqueBuyers = new Set<string>();
    const bookStatsMap = new Map<string, { purchaseCount: number; revenue: number }>();
    const providerCounts = new Map<string, number>();
    let paidOrdersCount = 0;
    let totalRevenue = 0;

    for (const doc of ordersSnap.docs) {
      const d = doc.data();
      const status = String(d.status ?? "");
      if (status !== "paid") continue;
      paidOrdersCount += 1;
      const amount = Number(d.amount) || 0;
      totalRevenue += amount;
      const uid = String(d.uid ?? "");
      if (uid) uniqueBuyers.add(uid);
      const bookId = String(d.bookId ?? "");
      if (bookId) {
        const cur = bookStatsMap.get(bookId) ?? { purchaseCount: 0, revenue: 0 };
        cur.purchaseCount += 1;
        cur.revenue += amount;
        bookStatsMap.set(bookId, cur);
      }
      const provider = String(d.provider ?? "unknown");
      providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
    }

    const recentOrders = ordersSnap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          uid: String(d.uid ?? ""),
          bookId: String(d.bookId ?? ""),
          amount: Number(d.amount) || 0,
          currency: String(d.currency ?? ""),
          status: String(d.status ?? ""),
          provider: String(d.provider ?? ""),
          createdAt: tsToMillis(d.createdAt),
        };
      })
      .filter((r) => r.status === "paid")
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      .slice(0, 30);

    const providersBreakdown = [...providerCounts.entries()].map(([provider, count]) => ({
      provider,
      count,
    }));

    const libraryActivationsByBook = new Map<string, number>();
    let libraryHolders = 0;
    let totalLibraryItems = 0;
    if (librarySnap) {
      totalLibraryItems = librarySnap.size;
      const holders = new Set<string>();
      for (const doc of librarySnap.docs) {
        const parent = doc.ref.parent.parent;
        if (parent) holders.add(parent.id);
        const d = doc.data();
        if (String(d.status ?? "") !== "paid") continue;
        const bid = String(d.bookId ?? doc.id);
        if (bid) {
          libraryActivationsByBook.set(bid, (libraryActivationsByBook.get(bid) ?? 0) + 1);
        }
      }
      libraryHolders = holders.size;
    }

    const allBookIds = new Set([...bookStatsMap.keys(), ...libraryActivationsByBook.keys()]);
    const bookStats = [...allBookIds].map((bookId) => {
      const o = bookStatsMap.get(bookId) ?? { purchaseCount: 0, revenue: 0 };
      return {
        bookId,
        purchaseCount: o.purchaseCount,
        libraryActivations: libraryActivationsByBook.get(bookId) ?? 0,
        revenue: o.revenue,
      };
    });

    const statsData = statsSnap.data();
    const pageViewsTotal = Number(statsData?.pageViewsTotal ?? 0);

    return {
      generatedAt: Date.now(),
      registeredUsers,
      uniqueBuyers: uniqueBuyers.size,
      paidOrdersCount,
      totalRevenue,
      libraryHolders,
      totalLibraryItems,
      libraryQueryOk: librarySnap !== null,
      pageViewsTotal,
      bookStats,
      recentOrders,
      providersBreakdown,
    };
  } catch (error) {
    logger.error("getOwnerDashboard error", error);
    throw new HttpsError("internal", "تعذر تحميل بيانات لوحة المالك.");
  }
});
