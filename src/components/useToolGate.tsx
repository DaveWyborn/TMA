"use client";

import { useState, useCallback } from "react";
import LimitReachedModal, { type LimitTier } from "./LimitReachedModal";

export function useToolGate() {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<LimitTier>("anon");

  const handleRateLimit = useCallback((t: LimitTier) => {
    setTier(t);
    setOpen(true);
  }, []);

  const notifyUsageChanged = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("usage-refresh"));
    }
  }, []);

  const modal = (
    <LimitReachedModal
      open={open}
      tier={tier}
      onClose={() => setOpen(false)}
    />
  );

  return { handleRateLimit, notifyUsageChanged, modal };
}
