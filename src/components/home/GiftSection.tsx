import { useState, type FormEvent } from "react";
import { gift } from "../../data/content.ar";
import { trackEvent } from "../../lib/analytics";
import { submitGiftLead } from "../../lib/giftLead";
import { SectionInner } from "../editorial/SectionInner";
import { EditorialButton } from "../ui/EditorialButton";

export function GiftSection() {
  const [status, setStatus] = useState<"idle" | "pending" | "ok" | "error" | "unavailable">("idle");
  const [stamped, setStamped] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const contact = String(fd.get("contact") ?? "");
    const website = String(fd.get("website") ?? "");
    setStatus("pending");
    const result = await submitGiftLead(contact, website);
    if (result === "ok") {
      trackEvent("submit_lead");
      form.reset();
      setStamped(true);
    }
    setStatus(result);
  }

  return (
    <section id={gift.id} className="relative scroll-mt-24 bg-sage py-20 md:py-28" data-thread-anchor="gift">
      <SectionInner>
        <div className="mx-auto max-w-lg">
          <div className="relative border-[3px] border-ink bg-paper shadow-hard">
            <div className="h-16 bg-peach/60 border-b-2 border-ink" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
            <div className="p-8 pt-12">
              <h2 className="font-display text-3xl leading-snug text-ink md:text-4xl">{gift.title}</h2>
              {status === "ok" ? (
                <p className="relative mt-8 text-lg text-forest" role="status">
                  {gift.success}
                  {stamped ? (
                    <span
                      className="absolute -top-4 end-0 rotate-[-8deg] border-4 border-terracotta px-4 py-2 font-hand text-2xl text-terracotta opacity-90"
                      aria-hidden
                    >
                      وصلتك ✦
                    </span>
                  ) : null}
                </p>
              ) : (
                <form className="relative mt-8 space-y-6" onSubmit={(e) => void onSubmit(e)}>
                  <label htmlFor="gift-contact" className="block font-hand text-xl text-ink/80">
                    {gift.placeholder}
                  </label>
                  <input
                    id="gift-contact"
                    name="contact"
                    type="text"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="…………………………"
                    disabled={status === "pending"}
                    className="min-h-12 w-full border-0 border-b-2 border-ink bg-transparent text-lg text-ink outline-none focus:border-terracotta"
                  />
                  <div className="absolute start-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                    <label>
                      الموقع
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <EditorialButton type="submit" variant="stamp" disabled={status === "pending"} className="w-full">
                    {status === "pending" ? "جاري الإرسال…" : gift.submit}
                  </EditorialButton>
                  <p className="text-lg text-ink/75">{gift.finePrint}</p>
                  {status === "error" ? (
                    <p className="text-lg text-terracotta" role="alert">{gift.error}</p>
                  ) : null}
                  {status === "unavailable" ? (
                    <p className="text-lg text-terracotta" role="alert">{gift.unavailable}</p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </SectionInner>
    </section>
  );
}
