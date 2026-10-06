import { getWhatsappUrl } from "../../lib/env";

export function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa fixed bottom-6 start-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-sage text-ink shadow-hard focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-terracotta"
      aria-label="واتساب"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.4-1.4a10 10 0 0 0 4.64 1.18h.04c5.46 0 9.89-4.4 9.89-9.84C21.97 6.4 17.5 2 12.04 2Zm5.76 14.17c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.3.59-.37.78-.37h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.5-.14.14-.28.29-.12.56.16.27.7 1.16 1.5 1.88 1.04.93 1.9 1.22 2.17 1.36.27.14.43.12.59-.07.16-.18.68-.8.86-1.07.18-.27.37-.22.62-.13.24.1 1.54.73 1.8.86.27.14.44.2.51.31.07.11.07.64-.17 1.32Z" />
      </svg>
    </a>
  );
}
