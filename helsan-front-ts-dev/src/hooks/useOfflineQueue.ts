// useOfflineQueue.ts
import { useToast } from "@/components/toast/ToastManager";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const isIOS = () => {
  const ua = navigator.userAgent || (navigator as any).vendor || "";
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  return ua.includes("Mac") && (navigator as any).maxTouchPoints > 1;
};

const hasBGSync = () =>
  "serviceWorker" in navigator && "SyncManager" in window && !isIOS();

export const useOfflineQueue = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // replaces toast.isActive(...)
  const offlineToastShownRef = useRef(false);
  const TOAST_DURATION = 3000; // or whatever you prefer

  useEffect(() => {
    const onQueued = () => {
      const msg = hasBGSync() ? t("notConnected") : t("isOffline");

      // if there is already an offline toast visible, do nothing
      if (offlineToastShownRef.current) return;

      offlineToastShownRef.current = true;

      addToast({
        type: hasBGSync() ? "info" : "warning",
        message: msg,
        duration: TOAST_DURATION,
        position: "topRight", // or any corner you like
      });

      // after it times out, allow showing it again
      setTimeout(() => {
        offlineToastShownRef.current = false;
      }, TOAST_DURATION + 100);
    };

    window.addEventListener("api:queued", onQueued as any);
    return () => window.removeEventListener("api:queued", onQueued as any);
  }, [t, addToast]);
};
