import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { BookId } from "../data/books";
import { db } from "./firebase";
import { getDiscountCode, getDiscountPercent } from "./env";

export type UserProfile = {
  name: string;
  email: string;
  photoURL: string;
  createdAt?: Timestamp;
};

export type LibraryItem = {
  bookId: BookId;
  purchasedAt?: Timestamp;
  orderId?: string;
  status?: "paid" | "pending";
};

export type ReaderPageChunk = {
  id: string;
  index: number;
  heading?: string;
  content: string;
};

export async function ensureUserProfile(user: User): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      name: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      createdAt: serverTimestamp(),
    });
    return;
  }

  await setDoc(
    ref,
    {
      name: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
    },
    { merge: true },
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function getUserLibrary(uid: string): Promise<LibraryItem[]> {
  const snapshot = await getDocs(collection(db, "users", uid, "library"));
  return snapshot.docs.map((item) => {
    const data = item.data() as Partial<LibraryItem>;
    const bookId = (data.bookId ?? item.id) as BookId;
    return {
      ...data,
      bookId,
      orderId: data.orderId,
      status: data.status,
      purchasedAt: data.purchasedAt,
    } as LibraryItem;
  });
}

export async function userOwnsBook(uid: string, bookId: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "users", uid, "library", bookId));
  return snapshot.exists() && snapshot.data().status === "paid";
}

export async function getBookPages(bookId: string): Promise<ReaderPageChunk[]> {
  const pagesRef = collection(db, "books", bookId, "pages");
  const pagesQuery = query(pagesRef, orderBy("index", "asc"));
  const pagesSnapshot = await getDocs(pagesQuery);

  return pagesSnapshot.docs.map((pageDoc) => {
    const data = pageDoc.data() as Omit<ReaderPageChunk, "id">;
    return {
      id: pageDoc.id,
      index: data.index,
      heading: data.heading,
      content: data.content,
    };
  });
}

/**
 * Spark plan: Cloud Functions cannot be deployed → no server-side redeem.
 * This path writes library entitlement from the client after verifying the
 * discount code matches env (100% discount only). Firestore rules must allow
 * the matching document shape (see firestore.rules).
 */
export async function claimFreeBookWithCode(
  uid: string,
  bookId: BookId,
  code: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const expected = getDiscountCode();
  const percent = getDiscountPercent();
  if (!expected || percent !== 100) {
    return { ok: false, message: "المنح المجاني غير مفعّل (تحققي من كود الخصم ونسبة 100%)." };
  }
  if (code.trim().toLowerCase() !== expected.toLowerCase()) {
    return { ok: false, message: "الكود غير صحيح." };
  }

  const orderId = `free-claim-${uid}-${bookId}`;
  try {
    await setDoc(
      doc(db, "users", uid, "library", bookId),
      {
        bookId,
        orderId,
        status: "paid",
        purchasedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return { ok: false, message: msg || "تعذر حفظ الكتاب. تحققي من قواعد Firestore المنشورة." };
  }
  return { ok: true };
}
