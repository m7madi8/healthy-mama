const KEY = "hm-motion-off";

export function isMotionOff(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.dataset.motion === "off") return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMotionOff(off: boolean): void {
  document.documentElement.dataset.motion = off ? "off" : "on";
  try {
    localStorage.setItem(KEY, off ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldReduceMotion(): boolean {
  return isMotionOff() || prefersReducedMotion();
}
