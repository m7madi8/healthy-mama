import { useEffect } from "react";
import { isFirebaseConfigured } from "../../lib/firebase";
import { recordPageViewOncePerSession } from "../../lib/ownerDashboard";

export function PageViewPing() {
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const recordInDev = import.meta.env.VITE_RECORD_PV_IN_DEV === "true";
    if (import.meta.env.DEV && !recordInDev) return;
    void recordPageViewOncePerSession();
  }, []);
  return null;
}
