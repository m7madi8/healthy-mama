/**
 * رفع صفحات دليل الاكتئاب إلى Firestore (يتجاوز قواعد العميل — يحتاج حساب خدمة).
 *
 * الإعداد (مرة واحدة):
 * 1. Firebase Console → Project settings → Service accounts → Generate new private key
 * 2. احفظي الملف JSON خارج المشروع (لا ترفعيه إلى Git)
 * 3. في PowerShell:
 *    $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"
 *    $env:FIREBASE_PROJECT_ID="your-project-id"
 *
 * التشغيل:
 *   npm run seed:book-postnatal
 *
 * اختياري — استبعاد صفحات داخلية (الموقع + الملحق):
 *   npm run seed:book-postnatal -- --skip-internal
 */
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { BOOK_POSTNATAL_DRAFT_PAGES } from "../src/data/book-postnatal-draft";

const INTERNAL_HEADINGS = new Set(["الدليل والموقع", "ملحق مهني"]);
const BOOK_ID = "book-postnatal";

function getCredentialPath(): string {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!path) {
    throw new Error(
      "عيّني GOOGLE_APPLICATION_CREDENTIALS إلى مسار ملف مفتاح حساب الخدمة (JSON).",
    );
  }
  return path;
}

function getProjectId(): string {
  return (
    process.env.FIREBASE_PROJECT_ID ??
    process.env.VITE_FIREBASE_PROJECT_ID ??
    (() => {
      throw new Error("عيّني FIREBASE_PROJECT_ID أو VITE_FIREBASE_PROJECT_ID.");
    })()
  );
}

async function main() {
  const skipInternal = process.argv.includes("--skip-internal");
  const cred = JSON.parse(readFileSync(getCredentialPath(), "utf8")) as Record<string, string>;

  initializeApp({
    credential: cert(cred),
    projectId: getProjectId(),
  });

  const db = getFirestore();
  let pages = [...BOOK_POSTNATAL_DRAFT_PAGES];

  if (skipInternal) {
    pages = pages.filter((p) => !INTERNAL_HEADINGS.has(p.heading ?? ""));
    pages = pages.map((p, i) => ({ ...p, index: i }));
    console.log("تم استبعاد الصفحات الداخلية وإعادة ترقيم الفهرس (0…).");
    console.warn(
      "تنبيه: إذا استخدمتِ --skip-internal، حدّثي pageIndex في src/data/book-postnatal-toc.ts ليطابق الترتيب الجديد.",
    );
  }

  const col = db.collection("books").doc(BOOK_ID).collection("pages");
  let written = 0;

  for (const page of pages) {
    const docId = `page-${page.index}`;
    await col.doc(docId).set({
      index: page.index,
      heading: page.heading ?? "",
      content: page.content ?? "",
    });
    written++;
    console.log(`✓ ${docId} — ${page.heading}`);
  }

  console.log(`\nتم رفع ${written} صفحة إلى books/${BOOK_ID}/pages`);
  console.log("\nالخطوة التالية للاختبار:");
  console.log("1. سجّلي دخولًا في الموقع (Google)");
  console.log("2. فعّلي الكتاب في المكتبة (شراء PayPal أو كود خصم 100%)");
  console.log("3. افتحي: /reader/book-postnatal");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
