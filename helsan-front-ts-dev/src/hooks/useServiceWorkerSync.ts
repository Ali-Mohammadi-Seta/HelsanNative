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

const FLUSH_DURATION = 3000; // ms – keep in sync with your defaults if needed

export const useServiceWorkerSync = (refetchAuth: () => void) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // replaces toast.isActive(FLUSH_TOAST_ID)
  const flushToastActiveRef = useRef(false);

  useEffect(() => {
    const onSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "QUEUE_FLUSHED") {
        // only show one "queue flushed" toast at a time
        if (!flushToastActiveRef.current) {
          flushToastActiveRef.current = true;

          // after it disappears, allow showing it again
          setTimeout(() => {
            flushToastActiveRef.current = false;
          }, FLUSH_DURATION + 100);
        }

        refetchAuth();
      }

      if (event.data?.type === "QUEUE_RETRY_LATER") {
        addToast({
          type: "warning",
          message: t("connectionError"),
          position: "topRight",
        });
      }
    };

    const forceSyncOnOnline = async () => {
      if (!hasBGSync()) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register("workbox-background-sync:important-api-queue");
      } catch {
        // ignore
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }
    window.addEventListener("online", forceSyncOnOnline);

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSwMessage);
      }
      window.removeEventListener("online", forceSyncOnOnline);
    };
  }, [t, addToast, refetchAuth]);
};
