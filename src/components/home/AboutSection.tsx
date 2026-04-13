import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { MotionFade } from "../ui/MotionFade";

export function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduce = useReducedMotion();

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 1;
      void video.play().catch(() => {});
    }
    setMuted(video.muted);
  }, []);

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <MotionFade variant="gentle-zoom">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <motion.div
                className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-petal shadow-lift ring-1 ring-sage-100/50"
                whileHover={reduce ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.35 }}
              >
                <video
                  ref={videoRef}
                  className="aspect-[3/4] w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=85"
                  aria-label="فيديو تعريفي — نوال عمر"
                >
                  <source src="/nawal_aom1.mp4" type="video/mp4" />
                </video>
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute bottom-4 end-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-sage-700 shadow-md backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                  aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                  {muted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              </motion.div>
            </div>
          </MotionFade>

          <MotionFade delay={0.1} variant="fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sage-500">من أنا</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-moss-900 sm:text-4xl">نوال عمر</h2>
            <p className="mt-2 text-lg font-medium text-sage-600">ممرضة ومدربة يوغا متخصصة في صحة المرأة والحمل</p>
            <p className="mt-6 leading-relaxed text-sage-700">
              أعمل مع النساء خلال الحمل وما بعد الولادة، وأجمع بين خبرتي في التمريض وشغفي باليوغا — لأقدّم معلومات
              طبية بلغة بسيطة تساعدك على فهم جسدك والشعور بمزيد من الأمان والثقة. حاصلة على بكالوريوس تمريض وبكالوريوس
              إدارة الأنظمة الصحية من جامعة تل أبيب، مع اهتمام بالتطبيب عن بُعد وصحة المرأة.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-sage-700">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                بكالوريوس تمريض، جامعة تل أبيب
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                بكالوريوس إدارة الأنظمة الصحية، جامعة تل أبيب
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                بحث في التطبيب عن بُعد
              </li>
            </ul>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
