# DESIGN BRIEF — نوال عمر | Healthy Mama  
## Botanical Editorial Maximalism + Stitch

**الإصدار:** 3.0 (يحل محل 2.0 Tatreez الأحمر الكامل — يدمج تطريزًا كتفصيل على عالم أغلفة الكتب)  
**الحالة:** مراجعة وموافقة قبل Phase A  
**النطاق:** الطبقة البصرية فقط — لا تغيير في scoring الكويز، الأسعار، الروابط، أو معنى نصوص المحتوى الحالية.

---

## Audit (10 lines)

1. **Stack:** Vite 6, React 19, TypeScript, React Router 7, Tailwind CSS v4 (`src/index.css` `@theme`), Framer Motion 12 — **لا GSAP/Lenis بعد**.  
2. **Home:** `HomePage.tsx` يجمع 10 أقسام + `FloatingWhatsApp`; layout عبر `PublicLayout` + `SiteNav` / `SiteFooter`.  
3. **المشكلة الحالية:** `max-w-6xl` (~1152px فعليًا ~740px محتوى)، خلفيات cream/milk متشابهة، `rounded-xl` + `shadow-lift` متكررة، عناوين ~28px، كويزات صغيرة.  
4. **المحتوى:** `src/data/content.ar.ts` (+ `books.ts`, `quizConfig`) — مصدر وحيد للنصوص العربية.  
5. **صور:** `public/healthymama.jpg` (Hero), `public/1.jpg`–`4.jpg` (أغلفة), جذر `01.png` / `02.png` (غير مستخدمة في Home حاليًا — مرشحة لصورة Story ثانية).  
6. **Gift:** `submitGiftLead` + honeypot موجودان (`functions`, `giftLead.ts`).  
7. **EPDS:** `QuizPage` + `EpdsCrisisScreen` + `epdsCopy`; `supportLinesByCountry` فارغ (TODO نوال).  
8. **Testimonials:** `testimonials[]` فارغ — القسم لا يُعرض.  
9. **Story:** `story.body` فارغ — placeholders بـ TODO فقط، لا سيرة مخترعة.  
10. **القرار:** إعادة بناء tokens + 9 مكوّنات UI مشتركة ثم أقسام Home مرحليًا؛ Calm Mode للكويز منفصل بصريًا.

---

## 1) مفهوم التصميم

مجلة صحية عربية **مطبوعة ومُلصقة يدويًا** للأمهات: كتل لون من ألوان الأغلفة (أخضر عميق، sage، خوخ مائي)، طباعة عملاقة، قصاصات، ورق، و**خيط terracotta واحد** يُخاط عبر الصفحة (إشارة خفيفة لتطريز، لا «زيّ كامل»).

**اختبار القبول:** لقطة 1440px و 390px بدون شعار — لا يجب أن تُوصف بـ «قالب».

---

## 2) Design tokens (`:root` فقط)

| Token | Value | Usage |
|-------|-------|--------|
| `--forest` | `#17382B` | Hero, Quizzes, Final base |
| `--forest-2` | `#0F2A20` | Footer |
| `--sage` | `#A9C2A0` | Gift section, book blocks |
| `--mint` | `#DCE9D6` | Notes, FAQ strips |
| `--cream` | `#F6EEDD` | Story, Books, FAQ — **لا يُستبدل بـ #fff** |
| `--paper` | `#FFFBF2` | Note cards فقط |
| `--peach` | `#F2B8A2` | How it works |
| `--saffron` | `#F0B33A` | Recognition |
| `--terracotta` | `#C4573A` | Thread, buttons, highlights |
| `--ink` | `#12201A` | Text on light |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | |
| `--ease-io` | `cubic-bezier(.76,0,.24,1)` | |

**قواعد:** لا أبيض/أسود صافي؛ لا gradients إلا overlay خفيف على الصور (`rgba(240,179,58,.08)` Hero).  
**تباين:** forest + cream text; saffron/peach/sage + ink — تحقق AA لكل زوج.

**Tailwind:** mapping في `@theme` يشير إلى هذه المتغيرات؛ إزالة تدريجيًا لـ `milk`, `shadow-lift`, `grove` من واجهة Home.

---

## 3) Typography

| Role | Font | Decision |
|------|------|----------|
| Display | **Lalezar** | أقوى ملاءمة لمجلة أمومة + أغلفة botanic؛ Rakkas أثقل سينمائيًا؛ Reem Kufi أقرب لـ tech. **خط display واحد فقط.** |
| Hand | Katibeh | ملاحظات، توقيع، tilt |
| Body/UI | IBM Plex Sans Arabic 400/500/700 | 18–20px, lh 1.8 |

**Scale (clamp):**
- Hero H1: `clamp(64px, 13vw, 220px)`, lh 0.9  
- Section H2: `clamp(44px, 8vw, 140px)`, lh 0.95  
- Statement: `clamp(32px, 5.5vw, 96px)`  
- Body: 18–20px  

**Emphasis (واحدة لكل H1/H2):** (a) outline `-webkit-text-stroke: 2px` + fill transparent، أو (b) Katibeh 3–5° saffron/terracotta، أو (c) cross-stitch SVG `background-clip: text`.  
**Animation:** أسطر أو كلمات فقط — **لا split حروف**.

**تحميل:** Google Fonts أو `@fontsource`، `font-display: swap`, subset عربي، preload display + body.

---

## 4) Global texture & layout

- **Grain:** fixed SVG `feTurbulence`, opacity `.07`, `multiply`, `pointer-events: none`.  
- **Shadows:** `8px 8px 0 var(--ink)` فقط — **استثناء واحد:** ظل contact ellipse تحت الكتب المعلقة (soft flat ellipse).  
- **Stitch dividers:** `3px dashed` أو SVG dash 10×8px.  
- **Sections:** `100vw` full-bleed؛ inner `max-width: 1440px`, `padding-inline: clamp(20px, 5vw, 80px)`؛ عناصر زخرفية/صور تكسر الحاوية.  
- **تسلسل الخلفيات (لا تكرار متجاور):**

| Order | Section | BG |
|-------|---------|-----|
| 0 | Nav | cream pill (floating) |
| 1 | Hero | `--forest` |
| 2 | Recognition | `--saffron` |
| 3 | Story | `--cream` |
| 4 | How | `--peach` |
| 5 | Quizzes | `--forest` |
| 6 | Books | `--cream` + sage blocks |
| 7 | Testimonials | *conditional* — إن وُجدت: cream/clothesline؛ إن لا: **تخطي** |
| 8 | Gift | `--sage` |
| 9 | FAQ | `--cream` |
| 10 | Final CTA | terracotta circle on `--forest` |
| 11 | Footer | `--forest-2` |

---

## 5) Shared components (`src/components/ui/`)

| # | Component | Purpose |
|---|-----------|---------|
| 1 | `ArchFrame` | `border-radius: 999px 999px 0 0`, border ink 3px, optional offset arch peach +16px rotate 4° |
| 2 | `Sticker` | 140–190px, `textPath` rotate 22s, CTA; hover scale 1.08 pause |
| 3 | `Marquee` | 2 rows opposite speed, `clamp(48px, 9vw, 150px)`, separators = 8-point star of × stitches |
| 4 | `StitchThread` | Global SVG 3–4px, terracotta/cream by bg; 2 layers over/under; ScrollTrigger scrub; resize debounced |
| 5 | `TornEdge` | SVG tear + 6px offset shadow in next section color |
| 6 | `NoteCard` | paper/peach/mint/saffron, rotation fixed per id [-6,6]°, washi strip, Katibeh |
| 7 | `StampBadge` | rubber stamp circle, 85% ink, rough filter |
| 8 | `Button` | pill 2px ink + hard shadow; hover translate(4,4) shadow 4px; min 52px; primary terracotta/cream |
| 9 | `CursorNeedle` | desktop `pointer:fine` only; thread trail canvas 12pt |

**Phase A deliverable:** route `DEV` only `/dev/ui` (مثل `BookPreviewPage`) يعرض كل المكوّنات.

---

## 6) StitchThread path plan

**Nodes (Y ≈ section mid, X weaves RTL):**

1. **Hero:** يبدأ من Sticker CTA (أسفل يسار Arch) — intro draw 1.6s.  
2. **Recognition:** يمر خلف ملاحظتين، أمام الثالثة، إلى جملة «طبيعية جدًا».  
3. **Story:** يحيط عمود النص (dashed frame)، يرسم توقيع SVG.  
4. **How:** يتبع **S-curve**؛ يتوقف عند ٠١ ٠٢ ٠٣ (nodes تفتح scale .6→1).  
5. **Quizzes:** يصل لحافة كل panel (لا يغطي النص).  
6. **Books:** يصبح **خيط تعليق** لكل غلاف (فروع قصيرة من path رئيسي).  
7. **Testimonials:** clothesline horizontal (إن وُجد القسم).  
8. **Gift:** يخيط حافة المغلف.  
9. **FAQ:** يمر خلف السؤال الأول فقط (خفيف).  
10. **Final:** **عقدة** — 8-point star أو heart outline يغلق حلقة Hero.

**Resize:** `getBoundingClientRect` لكل `[data-thread-anchor]` → rebuild path debounce 150ms.

---

## 7) Transition inventory

| ID | Trigger | Effect |
|----|---------|--------|
| T-hero-intro | load once | H1 line masks; arch scale .92; sticker pop; thread from sticker |
| T-hero-marquee | always | bottom border cream |
| T-rec-torn | scroll end Recognition | `TornEdge` → Story cream |
| T-story-sign | scroll in | signature stroke-dashoffset |
| T-how-thread | scrub | thread stops at steps |
| T-quiz-expand | click panel | View Transitions API → full viewport quiz; fallback GSAP Flip |
| T-book-select | click cover | center 1.25× + open book panel + outline title mask |
| T-gift-stamp | submit ok | stamp slam; flap close; envelope exit |
| T-final-knot | scroll Final | thread completes star |
| T-nav | scroll dir | hide down / show up |

**Pin:** ≤ 120vh, reversible. **Reduced motion:** thread full, no Lenis/marquee/pendulum/cursor.

**Motion stack:** GSAP + ScrollTrigger + Flip, Lenis lerp 0.09, budget ~180KB gzip added JS lazy.

---

## 8) Text wireframes (3 breakpoints)

### Nav (all)
- **≥1280:** pill centered min(92vw,1100px), logo + links + CTA + WA.  
- **768:** نفس مع تصغير links.  
- **<768:** logo + CTA + menu → fullscreen forest, links `clamp(40px,12vw,80px)` mask reveal.

---

### §1 Hero (`forest`, min 100svh)

| | Desktop ≥1200 | Tablet 768–1199 | Mobile <768 |
|---|---------------|-----------------|-------------|
| H1 | 4 lines, 13vw, behind photo; «طبيعي» Katibeh saffron +4° | 12vw | 17vw, 4–5 lines top |
| Photo | Arch 70svh, right of center, peach offset arch | 60svh | 62vw × 58svh overlaps H1 |
| Front | Sticker 180px; mint NoteCard + arrow; 3 motifs drift | Sticker 150px | Sticker 130px BR; note hidden |
| Bottom | Marquee dual row | same | same |

---

### §2 Recognition (`saffron`)

| | Desktop | Tablet | Mobile |
|---|---------|--------|--------|
| Layout | H2 huge RTL; «يشبهك» outline; 6 NoteCards on 12-col manual placement | overlap reduced | card stack swipe + «اسحبي» |
| Flip back | reassurance lines (من config جديد `relatable.reassurances[]` — 6 عبارات، تُضاف Phase C بدون تغيير `cards`) | same | tap flip |
| Close | `relatable.close` statement + «طبيعية جدًا» stitch-fill | | |

---

### §3 Story (`cream`)

| | Desktop | Tablet | Mobile |
|---|---------|--------|--------|
| Layout | vertical «قصتي» outline; Arch + pull-quote over edge; 2 cols unequal | quote full width | single column |
| Photo | hero crop أو `01.png`/`02.png` if suitable + duotone forest/cream; **TODO second Nawal photo** | | |
| Body | `story.body` or credentials split; empty → TODO pull-quotes DEV-only flag | | |
| Creds | 3 StampBadges from `story.credentials` parse | | |

---

### §4 How (`peach`)

| | Desktop | Tablet | Mobile |
|---|---------|--------|--------|
| Layout | S-curve SVG + 3 nodes; numbers outline 22vw cropped | | vertical S, steps alternate |
| Footer | ticket label for `howItWorks.note` | | |

---

### §5 Quizzes (`forest`)

| | Desktop | Tablet | Mobile |
|---|---------|--------|--------|
| Panels | 520/600/560px arches saffron/sage/peach, overlap top | 2+1 | scroll-snap 82vw + stitch dots |
| CTA | Sticker «ابدئي» per panel | | |
| Meta | existing hints + Edinburgh label postnatal | | |

---

### §6 Books (`cream` + sage)

| | Desktop | Tablet | Mobile |
|---|---------|--------|--------|
| Layout | 4 hanging 3D covers, terracotta threads, pendulum | 2 visible | drag carousel + bottom sheet |
| Detail | open book panel, price tag, existing URLs/prices | | |
| Bundle ribbon | **only if** bundle price added to config later | | |

---

### §7 Testimonials

- **Data:** `testimonials.length > 0` only. Else: DOM skip, thread books→gift.

---

### §8 Gift (`sage`)

- Envelope 3D, 40% visibility flap; form on card; stamp «وصلتك»; existing `submitGiftLead`.

---

### §9 FAQ (`cream`)

- Oversized questions; ×→✓ morph; answer strip peach/mint/saffron rotate; `grid 0fr→1fr`.

---

### §10 Final + §11 Footer

- Terracotta circle 90vw from bottom; `finalCta` copy; Sticker 200px; thread knot; marquee; footer `forest-2` compact.

---

## 9) Calm Mode (quiz routes)

| | Home maximal | Calm |
|---|--------------|------|
| BG | blocks | `#F6EEDD` flat |
| Grain/marquee/sticker/cursor | on | off |
| Progress | — | thin terracotta thread top |
| Questions | — | 36–56px display; pills 64px min |
| EPDS crisis/high | — | no commerce decoration; books companion only below, labeled |

Breathing circle 4s/6s corner optional; static if reduced motion.  
Toggle nav «إيقاف الحركات» + `localStorage` + `data-motion="off"`.

---

## 10) Content integrity & new config keys (visual copy only)

**لا تغيير:** existing strings, prices, links, quiz logic.

**يُضاف في `content.ar.ts` (Phase C+) — عربي فقط:**
- `relatable.reassurances`: string[6] لظهر البطاقات (مثال: «وهذا طبيعي»…)  
- `marquee.hero` / `marquee.final`: نصوص الماركوي (من البرومبت؛ استبدال ✦ بزخرفة stitch في UI لا في config إن رغبتِ)  
- `nav.ctaLabel`: «ابدئي الاستبيان» إن لزم فصل من `hero.cta`  
- `story.devPlaceholders`: optional DEV flag — لا سيرة حقيقية مخترعة  

**TODOs لنوال (document only):** `story.body`, photo #2, `testimonials`, `supportLinesByCountry`, bundle price.

---

## 11) Banned list (phase gate)

Equal card grids; `rounded-xl shadow-sm bg-white`; adjacent same bg/layout; emoji icons; soft shadows (except book ellipse); glassmorphism; purple/blue; universal fade-up; empty viewport without oversized type/image; default Tailwind focus blue.

---

## 12) Implementation phases (post-approval)

| Phase | Scope | Gate |
|-------|--------|------|
| **A** | Tokens, fonts, grain, 9 UI components, `/dev/ui` | build + lint |
| **B** | Nav + Hero + T-hero-* | screenshots 390/768/1440 |
| **C** | §2–4 | screenshots |
| **D** | §5–6 | screenshots |
| **E** | §8–11 + footer | screenshots |
| **F** | Calm Mode + EPDS screens | flow test |
| **G** | polish, a11y, Lighthouse mobile | report |

---

## 13) Decisions logged (no blocker)

1. **Display font:** Lalezar (see §3).  
2. **Story image fallback:** reuse `healthymama.jpg` alternate crop until second asset; try `01.png`/`02.png` in implementation — comment TODO.  
3. **Testimonials empty:** section omitted, thread skip.  
4. **v2.0 red color-block Tatreez:** superseded by botanical token table above.  
5. **GSAP/Lenis:** add in Phase A dependencies.

---

**Awaiting approval** on this brief to start **Phase A**. Reply approve or list edits.
