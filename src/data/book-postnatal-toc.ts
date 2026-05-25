/** فصول الدليل — ربط رقم الفصل بموضع الصفحة في القارئ (index يبدأ من 0) */
export type BookTocEntry = {
  chapter: number;
  /** عنوان الفهرس (يمكن أن يكون أوضح) */
  title: string;
  /** عنوان قصير يظهر أعلى الصفحة */
  shortTitle: string;
  pageIndex: number;
};

export const BOOK_POSTNATAL_TOC: BookTocEntry[] = [
  { chapter: 1, title: "لماذا كتبنا هذا الدليل؟", shortTitle: "لماذا هذا الدليل؟", pageIndex: 3 },
  { chapter: 2, title: "من أنا؟", shortTitle: "من أنا؟", pageIndex: 4 },
  { chapter: 3, title: "رسالة لكِ قبل أن نبدأ", shortTitle: "رسالة لكِ", pageIndex: 5 },
  { chapter: 4, title: "ماذا يحدث نفسيًا بعد الولادة؟", shortTitle: "ماذا يحدث نفسيًا؟", pageIndex: 6 },
  { chapter: 5, title: "الفرق بين الحزن الطبيعي والاكتئاب بعد الولادة", shortTitle: "حزن طبيعي أم اكتئاب؟", pageIndex: 7 },
  { chapter: 6, title: "لماذا يحدث الاكتئاب بعد الولادة؟", shortTitle: "لماذا يحدث؟", pageIndex: 8 },
  { chapter: 7, title: "العوامل التي قد تزيد الحساسية بعد الولادة", shortTitle: "عوامل الحساسية", pageIndex: 9 },
  { chapter: 8, title: "علامات قد تشعرين بها ولا تعرفين كيف تفسرينها", shortTitle: "علامات مربكة", pageIndex: 10 },
  { chapter: 9, title: "علامات التحذير التي تحتاج دعمًا سريعًا", shortTitle: "علامات عاجلة", pageIndex: 11 },
  { chapter: 10, title: "عندما يكون الطفل في الخداج أو احتاج مكوثًا في المستشفى", shortTitle: "الطفل في الخداج", pageIndex: 13 },
  { chapter: 11, title: "الرضاعة، الذنب، وصورة “الأم المثالية”", shortTitle: "الرضاعة والذنب", pageIndex: 14 },
  { chapter: 12, title: "علاقتكِ بجسدك بعد الولادة", shortTitle: "جسدك بعد الولادة", pageIndex: 15 },
  { chapter: 13, title: "أسئلة تفاعلية: أين أقف الآن؟", shortTitle: "أين أقف الآن؟", pageIndex: 16 },
  { chapter: 14, title: "خريطة المشاعر اليومية", shortTitle: "خريطة المشاعر", pageIndex: 17 },
  { chapter: 15, title: "تمارين تنفس آمنة ولطيفة بعد الولادة", shortTitle: "تمارين التنفس", pageIndex: 18 },
  { chapter: 16, title: "تهدئة الجهاز العصبي بخطوات بسيطة", shortTitle: "تهدئة الجهاز العصبي", pageIndex: 22 },
  { chapter: 17, title: "خطة 7 أيام للعودة إلى التوازن", shortTitle: "خطة 7 أيام", pageIndex: 23 },
  { chapter: 18, title: "كيف تطلبين المساعدة بدون شعور بالذنب؟", shortTitle: "طلب المساعدة", pageIndex: 24 },
  { chapter: 19, title: "دور الزوج/الشريك والعائلة", shortTitle: "دور العائلة", pageIndex: 25 },
  { chapter: 20, title: "كيف أشرح ما أمر به لمن حولي؟", shortTitle: "شرح ما أمرّ به", pageIndex: 26 },
  { chapter: 21, title: "متى أطلب دعمًا مهنيًا؟", shortTitle: "متى أطلب دعمًا؟", pageIndex: 27 },
  { chapter: 22, title: "ماذا قد يحدث في اللقاء المهني؟", shortTitle: "اللقاء المهني", pageIndex: 28 },
  { chapter: 23, title: "عبارات رحيمة للأم في الأيام الصعبة", shortTitle: "عبارات رحيمة", pageIndex: 29 },
  { chapter: 24, title: "صفحة كتابة: رسالتي لنفسي", shortTitle: "رسالتي لنفسي", pageIndex: 30 },
  { chapter: 25, title: "خاتمة: أنتِ لستِ وحدك", shortTitle: "أنتِ لستِ وحدك", pageIndex: 32 },
];

/** عناوين قصيرة لصفحات غير مدرجة في الفهرس الرئيسي */
export const BOOK_POSTNATAL_SHORT_HEADINGS: Record<number, string> = {
  0: "الاكتئاب بعد الولادة",
  1: "تنبيه مهم",
  2: "الفهرس",
  12: "«أنا المفروض أكون سعيدة»",
  19: "الزفير الطويل",
  20: "تنفس الشمعة",
  21: "العودة للحاضر",
  31: "الدليل والموقع",
  33: "ملحق مهني",
};

export function getPageShortHeading(pageIndex: number): string | undefined {
  const ch = BOOK_POSTNATAL_TOC.find((e) => e.pageIndex === pageIndex);
  if (ch) return ch.shortTitle;
  return BOOK_POSTNATAL_SHORT_HEADINGS[pageIndex];
}

export function getChapterForPage(pageIndex: number): BookTocEntry | undefined {
  return BOOK_POSTNATAL_TOC.find((e) => e.pageIndex === pageIndex);
}

export function formatTocPlainText(totalPages: number): string {
  return BOOK_POSTNATAL_TOC.map(
    (e) => `${e.chapter}. ${e.title}\n   صفحة ${e.pageIndex + 1} من ${totalPages}`,
  ).join("\n\n");
}

export function getBookToc(bookId: string): BookTocEntry[] | undefined {
  if (bookId === "book-postnatal") return BOOK_POSTNATAL_TOC;
  return undefined;
}
