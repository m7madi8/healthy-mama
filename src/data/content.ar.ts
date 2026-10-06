import type { BookId } from "./books";
import type { QuizKey } from "./quizConfig";

/** إجابات الاستبيان تُحسب في المتصفح ولا تُرسل لأي خادم (تحقق من QuizPage). */
export const QUIZ_ANSWERS_STAY_ON_DEVICE = true;

export type SupportLine = {
  country: string;
  label: string;
  phone: string;
};

export type Testimonial = {
  name: string;
  city: string;
  quote: string;
  photo?: string;
};

export type ConversionBook = {
  id: BookId;
  title: string;
  outcome: string;
  youWillKnow: [string, string, string];
  forWhom: string;
  notForWhom: string;
  price: number | null;
  buyUrl: string;
  guarantee: string;
};

export const site = {
  brand: "نوال عمر",
  product: "Healthy Mama",
  /** عنوان تبويب المتصفح (إنجليزي فقط) */
  tabTitle: "Healthy Mama",
  tagline: "صحة الأم والحمل وما بعد الولادة",
  seoTitle: "نوال عمر | Healthy Mama — استبيان الأم والكتب الرقمية",
  seoDescription:
    "استبيان من دقيقتين يخبركِ أين أنتِ الآن، وكتب رقمية هادئة من ممرضة ومدربة يوغا متخصصة في صحة المرأة.",
  ogImage: "/healthymama.jpg",
};

export const hero = {
  h1: "لا أحد قال لكِ أن هذا الشعور طبيعي... وأنا هنا لأقوله.",
  sub: "استبيان من دقيقتين يخبرك بوضوح أين أنتِ الآن، ويدلّك على الخطوة التالية. من ممرضة تعرف هذه الرحلة جيدًا.",
  cta: "ابدئي الآن، دقيقتان فقط 🌿",
  ctaHref: "/#quizzes",
  imageSrc: "/healthymama.jpg",
  imageAlt: "نوال عمر، ممرضة، تحتضن مولودًا نائمًا في جناح الولادة",
  underCtaFree: "مجاني",
  underCtaNoSignup: "بدون تسجيل",
  underCtaPrivacyOnDevice: "إجاباتك تبقى على جهازك",
  underCtaPrivacyShared: "إجاباتك سرية ولا نشاركها مع أحد",
};

/** ظهر بطاقات «هل هذا يشبهك؟» — نصوص بصرية فقط */
export const relatableReassurances = [
  "وهذا طبيعي.",
  "كثيرات يمررن بهذا.",
  "أنتِ لا تفشلين.",
  "مشاعرك مفهومة.",
  "طلب المساعدة قوة.",
  "أنتِ في المكان الصحيح.",
];

export const marquee = {
  hero: "لستِ وحدك ✦ مشاعرك حق ✦ دقيقتان لأجلك ✦",
  final: "لستِ وحدك ✦ مشاعرك حق ✦ ابدئي من هنا ✦",
};

export const navCopy = {
  ctaQuiz: "ابدئي الاستبيان",
  menuClose: "إغلاق",
  stopMotion: "إيقاف الحركات",
  resumeMotion: "تشغيل الحركات",
};

export const heroVisual = {
  stickerLabel: "استبيان ٢ دقيقة ✦ مجاني ✦",
  noteCard: "من ممرضة تعرف هذه الرحلة",
};

export const relatable = {
  id: "relatable",
  cards: [
    "أبكي ولا أعرف السبب.",
    "الكل يقول لي استمتعي، وأنا خائفة.",
    "جسدي لم يعد يشبهني.",
    "أبحث في جوجل الثالثة فجرًا وأخاف أكثر.",
    "أريد أن أكون أمًا جيدة وأشعر أنني أفشل.",
  ],
  close: "لو قلتِ «نعم» لواحدة منها، فأنتِ طبيعية جدًا. وأنتِ في المكان الصحيح.",
};

/**
 * نوال: اكتبي قصتك هنا (مشهد من جناح الولادة، لحظة التحول، لماذا بنيتِ المنصة).
 * إن بقي النص فارغًا يظهر الشريط المهني فقط.
 */
export const story = {
  id: "story",
  eyebrow: "قصتي",
  body: "",
  credentials: "ممرضة • مدربة يوغا • بكالوريوس تمريض وبكالوريوس إدارة أنظمة صحية.",
};

export const howItWorks = {
  id: "how-it-works",
  title: "كيف يعمل",
  steps: [
    { n: "١", title: "أجيبي عن أسئلة بسيطة" },
    { n: "٢", title: "احصلي على نتيجتك" },
    { n: "٣", title: "خذي خطوتك التالية" },
  ],
  note: "النتيجة ليست تشخيصًا، هي خريطة تساعدك على معرفة ما تحتاجينه.",
};

export const quizzes: {
  id: string;
  title: string;
  intro: string;
  items: {
    key: QuizKey;
    title: string;
    hint: string;
    imageSrc: string;
    imageAlt: string;
  }[];
} = {
  id: "quizzes",
  title: "الاستبيانات",
  intro: "اختاري مرحلتك — دقيقتان، بدون تسجيل.",
  items: [
    {
      key: "postnatal",
      title: "هل ما أشعر به طبيعي؟",
      hint: "بعد الولادة — مقياس إدنبرة، دقيقتان",
      imageSrc: "/quiz-postnatal.jpg",
      imageAlt: "رسم توضيحي لمرحلة ما بعد الولادة — استبيان المشاعر",
    },
    {
      key: "prep",
      title: "هل جسمي جاهز؟",
      hint: "قبل الحمل — ٢٠ سؤالًا",
      imageSrc: "/quiz-prep.jpg",
      imageAlt: "رسم توضيحي لتهيئة الجسد قبل الحمل",
    },
    {
      key: "pregnancy",
      title: "هل حملي يسير كما يجب؟",
      hint: "أثناء الحمل — ٢٠ سؤالًا",
      imageSrc: "/quiz-pregnancy.jpg",
      imageAlt: "رسم توضيحي لمرحلة الحمل — استبيان المتابعة",
    },
  ],
};

export const conversionBooks: {
  id: string;
  title: string;
  intro: string;
  buyNow: string;
  comingSoon: string;
  items: ConversionBook[];
} = {
  id: "books",
  title: "الكتب",
  intro: "أدلة رقمية — اختاري دليلك واطلعي على التفاصيل أو اشترِ مباشرة.",
  buyNow: "احصلي عليه الآن",
  comingSoon: "قريبًا",
  items: [
    {
      id: "book-postnatal",
      title: "الاكتئاب بعد الولادة",
      outcome: "افهمي مشاعرك واستعيدي توازنك",
      youWillKnow: [
        "الفرق بين الحزن الطبيعي والاكتئاب",
        "متى تطلبين المساعدة",
        "كيف تتحدثين مع أسرتك",
      ],
      forWhom: "لأمهات يشعرن بضيق أو حزن أو ارتباك بعد الولادة ويبحثن عن فهم هادئ.",
      notForWhom: "ليس بديلاً عن التقييم النفسي أو العلاج الطبي العاجل.",
      price: 49,
      buyUrl: "/books/book-postnatal",
      guarantee: "",
    },
    {
      id: "book-prep",
      title: "تهيئة الجسد للحمل",
      outcome: "ادخلي رحلة الحمل وأنتِ مطمئنة",
      youWillKnow: [
        "أي فحوصات تحتاجين",
        "ماذا تأكلين",
        "كيف تجهزين جسمك ونفسك",
      ],
      forWhom: "لمن تخطط للحمل وتريد خطوات عملية قبل البداية.",
      notForWhom: "ليس تشخيصًا طبيًا ولا يغني عن متابعة الطبيب.",
      price: 49,
      buyUrl: "/books/book-prep",
      guarantee: "",
    },
    {
      id: "book-pregnancy",
      title: "رحلة الحمل شهرًا بشهر",
      outcome: "افهمي كل تغيّر في جسمك",
      youWillKnow: [
        "الطبيعي من المقلق",
        "التمارين الآمنة",
        "كيف تخففين آلام الظهر والحوض",
      ],
      forWhom: "للحامل التي تريد خريطة شهرية هادئة لجسمها ونمو طفلها.",
      notForWhom: "ليس بديلاً عن فحوصات الحمل أو مراجعة الطوارئ.",
      price: 49,
      buyUrl: "/books/book-pregnancy",
      guarantee: "",
    },
    {
      id: "book-recovery",
      title: "الأربعون يومًا بعد الولادة",
      outcome: "تعافي بلطف",
      youWillKnow: [
        "كيف يتعافى جسدك",
        "كيف تنظمين النوم والرضاعة",
        "كيف تعتنين بنفسك",
      ],
      forWhom: "لأمهات في الأسابيع الأولى بعد الولادة يحتجن دليلاً لطيفًا للتعافي.",
      notForWhom: "ليس علاجًا لمضاعفات طبية تستوجب مراجعة الطبيب فورًا.",
      price: 49,
      buyUrl: "/books/book-recovery",
      guarantee: "",
    },
  ],
};

/** أضيفي شهادات بإذن خطي فقط. إن بقيت المصفوفة فارغة لا يُعرض القسم. */
export const testimonials: Testimonial[] = [];

export const gift = {
  id: "gift",
  title: "قبل أن تذهبي: دليل مجاني بعنوان «ما لا يقوله لكِ أحد في أول ٤٠ يومًا».",
  placeholder: "واتساب أو إيميل",
  submit: "أرسلي لي الدليل",
  finePrint: "لن نرسل لكِ إلا ما يفيدك، ويمكنك الإلغاء متى شئتِ.",
  success: "شكرًا لكِ. سنرسل الدليل إلى وسيلة التواصل التي كتبتِها.",
  error: "تعذر الإرسال الآن. جرّبي مرة أخرى أو تواصلي عبر واتساب.",
  unavailable: "التسجيل غير متاح مؤقتًا. تواصلي معنا عبر واتساب لتصلكِ الهدية.",
};

export const faq = {
  id: "faq",
  title: "أسئلة شائعة",
  doctor: {
    q: "هل هذا بديل عن الطبيب؟",
    a: "لا، هو للتوعية ولا يغني عن الاستشارة الطبية.",
  },
  privacy: {
    q: "هل إجاباتي سرية؟",
    aOnDevice: "نعم. الاستبيان يُحسب على جهازك ولا نرسل إجاباتك إلى أي خادم.",
    aShared: "إجاباتك سرية ولا نشاركها مع أحد.",
  },
  duration: {
    q: "كم يستغرق الاستبيان؟",
    a: "دقيقتان تقريبًا.",
  },
  booksFit: {
    q: "هل الكتب مناسبة لحالتي؟",
    a: "كل كتاب فيه «لمن هذا الكتاب» و«لمن لا يناسب».",
  },
  refund: {
    q: "ماذا لو لم يعجبني الكتاب؟",
    aFallback: "تواصلي معنا عبر واتساب وسنساعدكِ بما يناسب طلبكِ.",
  },
  who: {
    q: "من يقف خلف المنصة؟",
    a: "نوال عمر، ممرضة ومدربة يوغا متخصصة في صحة المرأة.",
  },
};

export const finalCta = {
  id: "final-cta",
  title: "دقيقتان لأجلك، أنتِ التي تعتنين بالجميع.",
  button: "ابدئي الاستبيان",
  href: "/#quizzes",
  close: "لستِ وحدك. ابدئي من هنا.",
};

export const footer = {
  disclaimer: "المحتوى تثقيفي عام ولا يغني عن الاستشارة الطبية.",
  copyright: "© 2026 نوال عمر.",
  whatsapp: "واتساب",
};

export const epdsCopy = {
  crisisTitle: "أنتِ لستِ وحدك في هذه اللحظة",
  crisisBody:
    "ما تشعرين به حقيقي ويستحق دعمًا. إن كانت لديكِ أفكار لإيذاء نفسك، تواصلي فورًا مع شخص تثقين به أو مع طبيب أو خط دعم في بلدك.",
  crisisNoMarketing: true,
  highTitle: "ما تشعرين به حقيقي ويستحق دعمًا",
  highBody:
    "نتيجتك تشير إلى حاجة واضحة لمتابعة مهنية. راجعي طبيبًا أو مختصًا نفسيًا في أقرب وقت. هذا الاستبيان ليس تشخيصًا.",
  highBookLabel: "قد يرافقك",
  mediumTitle: "أنتِ تستحقين أن تُسمعي",
  mediumBody:
    "من المفيد التحدث مع طبيبكِ أو ممرضتكِ عمّا تشعرين به. الدليل أدناه مكمّل للتوعية، وليس بديلاً عن الرعاية.",
  lowTitle: "هذه المشاعر جزء من الرحلة",
  lowBody:
    "نتيجتك في نطاق مطمئن بحسب هذا المقياس. اعتني بنفسك، واطلبي الدعم من محيطك متى احتجتِ. الدليل خيار مرافق للمعرفة إن رغبتِ.",
  companionCta: "مرافق للقراءة إن رغبتِ",
  complementCta: "دليل مكمّل للتوعية",
};

/**
 * TODO لنوال: املئي أرقام خطوط دعم موثوقة حسب البلد. لا تُعرض أرقام مخترعة.
 * الشكل: { country: "فلسطين", label: "خط الدعم", phone: "+970..." }
 */
export const supportLinesByCountry: SupportLine[] = [];

export function privacyLine(): string {
  return QUIZ_ANSWERS_STAY_ON_DEVICE ? hero.underCtaPrivacyOnDevice : hero.underCtaPrivacyShared;
}

export function faqPrivacyAnswer(): string {
  return QUIZ_ANSWERS_STAY_ON_DEVICE ? faq.privacy.aOnDevice : faq.privacy.aShared;
}

export function anyBookHasGuarantee(): boolean {
  return conversionBooks.items.some((b) => b.guarantee.trim().length > 0);
}
