import { useEffect } from "react";
import { shouldReduceMotion } from "../../lib/motionPrefs";

export function NeedleCursor() {
  useEffect(() => {
    if (shouldReduceMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.createElement("div");
    dot.className = "needle-cursor";
    document.body.appendChild(dot);

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      dot.remove();
    };
  }, []);

  return null;
}
