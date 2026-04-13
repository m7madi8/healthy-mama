import { useEffect } from "react";
import { isFirebaseConfigured } from "../../lib/firebase";
import { recordPageViewOncePerSession } from "../../lib/ownerDashboard";

export function PageViewPing() {
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    void recordPageViewOncePerSession();
  }, []);
  return null;
}
