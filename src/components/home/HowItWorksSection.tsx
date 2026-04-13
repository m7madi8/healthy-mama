import { MotionFade } from "../ui/MotionFade";
import { MotionStagger, MotionStaggerItem } from "../ui/MotionStagger";

const steps = [
  {
    n: "٠١",
    title: "أجيبي عن أسئلة بسيطة",
    body: "تدفق هادئ خطوة بخطوة — بدون مصطلحات معقدة، أسئلة تعكس شعورك وحالتك.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    n: "٠٢",
    title: "احصلي على نتيجتك",
    body: "ملخص واضح لما تشير إليه إجاباتك — لتلمسي الصورة دون أن تكوني وحدك في التخمين.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    n: "٠٣",
    title: "الكتاب الأنسب لك",
    body: "نوصيك بدليل يناسب مرحلتك، ويمكنك إتمام الشراء بأمان عندما تكونين جاهزة.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6.75 7.5v8.568m0 0-.003.003a.75.75 0 1 0 .674.671 12.04 12.04 0 0 0 6.294-6.294.75.75 0 0 0-.63-.764 9.057 9.057 0 0 1-3.335-.571m0 0A9.057 9.057 0 0 0 12 17.25a9.057 9.057 0 0 0 3.334.571m0 0V7.5m0 0A8.967 8.967 0 0 1 12 6.042" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-sage-100/80 bg-white/50 py-20 backdrop-blur-[2px] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionFade variant="gentle-zoom">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-sage-500">كيف يعمل</p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">
            ثلاث خطوات بسيطة للوضوح
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sage-600">
            مصمم لوقتك وطاقتك — تبدأين بسرعة، تفهمين بسهولة، وتتخذين خطوة واضحة للأمام.
          </p>
        </MotionFade>

        <MotionStagger className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12} delayChildren={0.06}>
          {steps.map((s) => (
            <MotionStaggerItem key={s.n}>
              <article className="group relative h-full rounded-3xl border border-sage-100/90 bg-milk/80 p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sage-200 hover:bg-white hover:shadow-lift">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-3xl font-semibold text-sage-200 transition-colors group-hover:text-sage-300">
                    {s.n}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-600 transition-transform duration-300 group-hover:scale-105 group-hover:bg-sage-200/80">
                    {s.icon}
                  </div>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-moss-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sage-600">{s.body}</p>
              </article>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
