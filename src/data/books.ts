export type BookId = "book-postnatal" | "book-prep" | "book-pregnancy" | "book-recovery";

export type Book = {
  id: BookId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  cardDescription: string;
  benefits: string[];
  titleEn: string;
  shortTitleEn: string;
  descriptionEn: string;
  cardDescriptionEn: string;
  benefitsEn: string[];
  coverSrc: string;
  price: number;
  paypalItemTitle: string;
  paypalTitleEn: string;
  documentTitle: string;
};

export const BOOKS: Book[] = [
  {
    id: "book-postnatal",
    slug: "book-postnatal",
    title: "الاكتئاب بعد الولادة: دليل الأم لفهم مشاعرها واستعادة توازنها",
    shortTitle: "الاكتئاب بعد الولادة",
    description:
      "الفرق بين الحزن الطبيعي والاكتئاب بعد الولادة، الأسباب الهرمونية والنفسية، علامات التحذير، تمارين التنفس، دور الأسرة، ومتى تطلب المساعدة المهنية.",
    cardDescription:
      "الفرق بين الحزن الطبيعي والاكتئاب بعد الولادة، الأسباب الهرمونية والنفسية، علامات التحذير، تمارين التنفس، دور الأسرة، متى تطلب المساعدة.",
    benefits: [
      "شرح واضح ورحيم يمكنك الاعتماد عليه",
      "تمارين عملية واستراتيجيات مواجهة",
      "متى تطلبين الدعم المهني",
    ],
    titleEn: "Postpartum depression: a mother’s guide to understanding her feelings",
    shortTitleEn: "Postpartum wellbeing",
    descriptionEn:
      "Understand the difference between baby blues and postpartum depression, hormonal and emotional factors, warning signs, breathing exercises, family support, and when to seek professional help.",
    cardDescriptionEn:
      "Evidence-based guidance on mood after birth, warning signs, and gentle tools you can use today.",
    benefitsEn: [
      "Clear, compassionate explanations you can trust",
      "Practical exercises and coping strategies",
      "When to reach out for professional support",
    ],
    coverSrc: "/1.jpg",
    price: 49,
    paypalItemTitle: "الاكتئاب بعد الولادة — نوال عمر",
    paypalTitleEn: "Healthy Mama — Postpartum guide (e-book)",
    documentTitle: "الاكتئاب بعد الولادة — نوال عمر",
  },
  {
    id: "book-prep",
    slug: "book-prep",
    title: "كيف تهيئين جسدك للحمل: دليل علمي قبل بداية الرحلة",
    shortTitle: "تهيئة الجسد للحمل",
    description:
      "الفحوصات الضرورية قبل الحمل، التغذية المثالية، الفيتامينات الأساسية، تصحيح نمط الحياة، تقوية قاع الحوض، والاستعداد النفسي للأمومة.",
    cardDescription:
      "الفحوصات الضرورية قبل الحمل، التغذية المثالية، الفيتامينات الأساسية، تصحيح نمط الحياة، تقوية قاع الحوض، الاستعداد النفسي للأمومة.",
    benefits: [
      "قائمة فحوصات وخطوات صحية قبل الحمل",
      "إرشادات التغذية والمكملات",
      "عادات للجسد والذهن تدعم الخصوبة",
    ],
    titleEn: "Prepare your body for pregnancy: a science-based pre-conception guide",
    shortTitleEn: "Pre-conception prep",
    descriptionEn:
      "Essential check-ups, nutrition, key supplements, lifestyle tweaks, pelvic floor basics, and emotional readiness before you conceive.",
    cardDescriptionEn:
      "Step-by-step prep so you feel confident before trying to conceive.",
    benefitsEn: [
      "Checklist of pre-pregnancy health steps",
      "Nutrition and supplement guidance",
      "Mind–body habits that support fertility",
    ],
    coverSrc: "/2.jpg",
    price: 49,
    paypalItemTitle: "تهيئة الجسد للحمل — نوال عمر",
    paypalTitleEn: "Healthy Mama — Pre-conception guide (e-book)",
    documentTitle: "تهيئة الجسد للحمل — نوال عمر",
  },
  {
    id: "book-pregnancy",
    slug: "book-pregnancy",
    title: "رحلة الحمل: ماذا يحدث في جسمك شهرًا بعد شهر",
    shortTitle: "رحلة الحمل شهرًا بشهر",
    description:
      "تغيرات جسم الأم، نمو الجنين، أعراض طبيعية وأعراض تستوجب مراجعة الطبيب، تمارين آمنة للحامل، ونصائح لتخفيف آلام الظهر والحوض.",
    cardDescription:
      "تغيرات جسم الأم، نمو الجنين، أعراض طبيعية وأعراض تستوجب مراجعة الطبيب، تمارين آمنة للحامل، نصائح لتخفيف آلام الظهر والحوض.",
    benefits: [
      "معالم شهرية لجسمك ولنمو الطفل",
      "أعراض تحذيرية يجب الانتباه لها",
      "حركة لطيفة لمزيد من الراحة",
    ],
    titleEn: "Your pregnancy journey: month by month in your body",
    shortTitleEn: "Pregnancy month by month",
    descriptionEn:
      "How your body changes, baby’s growth, what’s normal vs. when to call your provider, safe movement, and comfort tips for back and pelvis.",
    cardDescriptionEn:
      "A calm roadmap through each trimester — symptoms, milestones, and red flags.",
    benefitsEn: [
      "Month-by-month body and baby milestones",
      "Clear red-flag symptoms to watch for",
      "Gentle movement ideas for comfort",
    ],
    coverSrc: "/3.jpg",
    price: 49,
    paypalItemTitle: "رحلة الحمل شهرًا بشهر — نوال عمر",
    paypalTitleEn: "Healthy Mama — Pregnancy month by month (e-book)",
    documentTitle: "رحلة الحمل شهرًا بشهر — نوال عمر",
  },
  {
    id: "book-recovery",
    slug: "book-recovery",
    title: "الأربعون يومًا الأولى بعد الولادة: دليل التعافي الجسدي والنفسي للأم",
    shortTitle: "الأربعون يومًا بعد الولادة",
    description:
      "التعافي الجسدي، الرضاعة الطبيعية، النوم والتعب، تقوية قاع الحوض بعد الولادة، والعناية بالصحة النفسية.",
    cardDescription:
      "التعافي الجسدي، الرضاعة الطبيعية، النوم والتعب، تقوية قاع الحوض بعد الولادة، العناية بالصحة النفسية.",
    benefits: [
      "جداول تعافي وأولويات عناية ذاتية",
      "استراتيجيات للرضاعة والراحة",
      "نقاط فحص للصحة النفسية",
    ],
    titleEn: "The first forty days: physical and emotional recovery for new mothers",
    shortTitleEn: "Fourth trimester recovery",
    descriptionEn:
      "Healing after birth, breastfeeding basics, sleep and fatigue, pelvic floor recovery, and nurturing your mental health in the fourth trimester.",
    cardDescriptionEn:
      "Gentle, practical recovery guidance for the weeks right after birth.",
    benefitsEn: [
      "Recovery timelines and self-care priorities",
      "Feeding and rest strategies that actually help",
      "Emotional health checkpoints",
    ],
    coverSrc: "/4.jpg",
    price: 49,
    paypalItemTitle: "الأربعون يومًا بعد الولادة — نوال عمر",
    paypalTitleEn: "Healthy Mama — Fourth trimester recovery (e-book)",
    documentTitle: "الأربعون يومًا بعد الولادة — نوال عمر",
  },
];

export function getBookBySlug(slug: string | undefined): Book | undefined {
  if (!slug) return undefined;
  return BOOKS.find((b) => b.slug === slug);
}

export function getBookById(id: string | undefined): Book | undefined {
  if (!id) return undefined;
  return BOOKS.find((b) => b.id === id);
}

export function isBookId(id: string | null | undefined): id is BookId {
  return BOOKS.some((b) => b.id === id);
}

export const THANK_YOU_BOOK_LABELS: Record<BookId, string> = {
  "book-postnatal": "الاكتئاب بعد الولادة",
  "book-prep": "تهيئة الجسد للحمل",
  "book-pregnancy": "رحلة الحمل شهرًا بشهر",
  "book-recovery": "الأربعون يومًا بعد الولادة",
};

export const THANK_YOU_BOOK_LABELS_EN: Record<BookId, string> = {
  "book-postnatal": "Postpartum wellbeing guide",
  "book-prep": "Pre-conception guide",
  "book-pregnancy": "Pregnancy month by month",
  "book-recovery": "Fourth trimester recovery",
};
