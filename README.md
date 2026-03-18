# Hero Section — Nawal Omar · Pregnancy & Postnatal Wellness

Ultra-modern, minimalist hero for a pregnancy and postnatal wellness site (Arabic, RTL).

## Quick start

Open `index.html` in a browser, or run a local server:

```bash
npx serve .
```

## Customization

- **Hero background photo**  
  To use your own cinematic yoga/pregnancy image as the full-width background: add class `has-photo` to the element with `data-parallax` in `index.html`, and set the image in CSS, e.g.  
  `--hero-photo: url('your-image.jpg');` on `.hero-bg` or `:root`.

- **CTA links**  
  Update the `href` on each `.hero-btn` (`#postnatal`, `#prep`, `#pregnancy`) to point to your real sections or pages.

- **Image in the card**  
  Replace the `src` of the `.hero-image` in `index.html` with your own photo path.

## About Me section

- **Portrait**  
  Replace the `.about-portrait` `src` with Nawal’s photo (e.g. yoga/wellness portrait).
- **Credentials**  
  Edit the list items in `.about-credentials-list` to add or change degrees.
- **Key phrases**  
  Wrap any phrase in `<span class="highlight">` for the muted sage accent.

## Quiz Results & Recommended Books

- **Personalized message**  
  Use URL params so the message updates by quiz outcome:  
  `?result=postnatal` | `?result=prep` | `?result=pregnancy`  
  Or use `?score=0–100` (0–33 → postnatal, 34–66 → prep, 67–100 → pregnancy).
- **Book CTAs**  
  Set each `.quiz-book-cta` `href` to your purchase or download page.
- **Book images**  
  Replace the mockup image `src` in each `.quiz-book-mockup-inner img` with your e‑book cover or mockup.

## Contact section

- **Thank-you message**  
  Shown after form submit (no backend; form is reset). To show the book recommendation only when the user came from the quiz, in `script.js` hide `#contact-thanks-reco` when `?result` / `?score` are not in the URL.
- **Form action**  
  Wire the form to your backend by adding `action` and `method` to the `<form>`, or handle submit via your own script.

## Tech

- **HTML** — Semantic, RTL, `lang="ar"`, `dir="rtl"`.
- **CSS** — Variables, glassmorphism, responsive grid, reduced-motion support.
- **JS** — Lightweight parallax on scroll (respects `prefers-reduced-motion`).

Fonts: Noto Serif Arabic (headings), Noto Sans Arabic (body), loaded from Google Fonts.
