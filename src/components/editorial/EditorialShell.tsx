import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { PaperGrain } from "./PaperGrain";
import { isMotionOff, setMotionOff, shouldReduceMotion } from "../../lib/motionPrefs";

type EditorialShellProps = {
  children: ReactNode;
  calm?: boolean;
};

export function EditorialShell({ children, calm = false }: EditorialShellProps) {
  useEffect(() => {
    if (calm) {
      document.documentElement.classList.add("calm-mode");
      return () => document.documentElement.classList.remove("calm-mode");
    }
    document.documentElement.classList.remove("calm-mode");
    const stored = isMotionOff();
    document.documentElement.dataset.motion = stored ? "off" : "on";
  }, [calm]);

  useEffect(() => {
    if (calm || shouldReduceMotion()) return;

    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [calm]);

  return (
    <>
      {!calm ? <PaperGrain /> : null}
      {children}
    </>
  );
}

// re-export for nav init
export { setMotionOff, isMotionOff };
