export type AnalyticsEvent = "start_quiz" | "complete_quiz" | "click_buy" | "submit_lead";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** أحداث بدون إجابات صحية أو نصوص حرة من الاستبيان. */
export function trackEvent(name: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  const event = { event: name, ...payload };
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}
