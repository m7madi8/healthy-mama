import { getContactFormAction, getGiftLeadUrl } from "./env";

export type GiftLeadResult = "ok" | "error" | "unavailable";

function isValidContact(value: string): boolean {
  const v = value.trim();
  if (v.length < 5 || v.length > 120) return false;
  if (v.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  return /^[+0-9][0-9\s-]{6,}$/.test(v);
}

export async function submitGiftLead(contact: string, honeypot: string): Promise<GiftLeadResult> {
  if (honeypot.trim()) return "ok";
  if (!isValidContact(contact)) return "error";

  const functionUrl = getGiftLeadUrl();
  if (functionUrl) {
    try {
      const res = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ contact: contact.trim(), website: honeypot }),
      });
      if (!res.ok) return "error";
      return "ok";
    } catch {
      return "error";
    }
  }

  const formspree = getContactFormAction();
  if (formspree) {
    try {
      const body = new FormData();
      body.append("contact", contact.trim());
      body.append("source", "gift-guide");
      const res = await fetch(formspree, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return "error";
      return "ok";
    } catch {
      return "error";
    }
  }

  return "unavailable";
}
