// ToastView.tsx
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ToastPosition, ToastType } from "./toastApi";

// --- Styles and Icons ---

const typeStyles: Record<ToastType, string> = {
  success: "border-green-500 text-green-700",
  error: "text-red-700",
  warning: "border-yellow-500 text-yellow-700",
  info: "border-blue-500 text-blue-700",
};

const iconWrapper: Record<ToastType, string> = {
  success: "bg-green-100 border-green-500 text-green-600",
  error: "bg-red-100 border-red-500 text-red-600",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-600",
  info: "bg-blue-100 border-blue-500 text-blue-600",
};

const typeIcons: Record<ToastType, ReactNode> = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
      />
    </svg>
  ),
};

const CloseIcon: ReactNode = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3 text-current cursor-pointer"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 8.586l4.95-4.95a1 1 0 011.414 1.415L11.415 10l4.95 4.95a1 1 0 01-1.415 1.414L10 11.415l-4.95 4.95a1 1 0 01-1.414-1.415L8.586 10l-4.95-4.95A1 1 0 015.05 3.636L10 8.586z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Component ---

interface ToastProps {
  type?: ToastType;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  duration?: number;
  onClose?: () => void;
  closable?: boolean;
  pauseOnHover?: boolean; // optional, default false
  position?: ToastPosition; // used to choose slide-in direction
}

/**
 * Circular countdown ring that reads remaining time via a callback.
 * rAF-driven so each toast animates reliably.
 */
const CircularCountdown: FC<{
  duration: number;
  getRemaining: () => number;
  strokeWidth?: number;
}> = ({ duration, getRemaining, strokeWidth = 2 }) => {
  if (!duration || duration <= 0) return null;

  const progressRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const remaining = getRemaining();
      const progress = Math.min(
        1,
        Math.max(0, (duration - remaining) / duration)
      );
      if (progressRef.current) {
        progressRef.current.setAttribute("stroke-dashoffset", String(progress));
      }
      if (remaining > 0) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, getRemaining]);

  return (
    <div className="absolute inset-0 -m-[2px] pointer-events-none z-10">
      <svg
        className="w-full h-full rotate-[-90deg]"
        viewBox="0 0 36 36"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.25}
        />
        {/* Progress */}
        <circle
          ref={progressRef}
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1 }}
        />
      </svg>
    </div>
  );
};

const ANIM_MS = 300;

const Toast: FC<ToastProps> = ({
  type = "info",
  children,
  className,
  icon,
  duration = 3000,
  onClose,
  closable = false,
  pauseOnHover = true,
  position = "topRight",
}) => {
  // Slide-in/out animation state
  const [shown, setShown] = useState(false);
  const exitingRef = useRef(false);

  // Timer bookkeeping for accurate remaining time and optional pause
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const pausedRef = useRef<boolean>(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const requestClose = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    clearTimer();
    setShown(false); // trigger slide-out
    setTimeout(() => {
      onClose?.();
    }, ANIM_MS);
  }, [onClose]);

  const startTimer = useCallback(() => {
    if (duration <= 0) return;
    startRef.current = performance.now();
    clearTimer();
    timerRef.current = setTimeout(requestClose, remainingRef.current);
  }, [duration, requestClose]);

  useEffect(() => {
    // Enter animation
    // Ensure initial hidden state, then show on next frame
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    // initialize timer
    remainingRef.current = duration;
    if (duration > 0) {
      pausedRef.current = false;
      startTimer();
    }
    return () => clearTimer();
  }, [duration, startTimer]);

  const getRemaining = useCallback(() => {
    if (duration <= 0) return 0;
    if (pausedRef.current) return remainingRef.current;
    const elapsedSinceStart = performance.now() - startRef.current;
    return Math.max(0, remainingRef.current - elapsedSinceStart);
  }, [duration]);

  const onMouseEnter = () => {
    if (!pauseOnHover || duration <= 0) return;
    if (pausedRef.current) return;
    const elapsedSinceStart = performance.now() - startRef.current;
    remainingRef.current = Math.max(
      0,
      remainingRef.current - elapsedSinceStart
    );
    pausedRef.current = true;
    clearTimer();
  };

  const onMouseLeave = () => {
    if (!pauseOnHover || duration <= 0) return;
    if (!pausedRef.current) return;
    pausedRef.current = false;
    startTimer();
  };

  // Direction-aware classes (like React-Toastify)
  const isLeft = position === "topLeft" || position === "bottomLeft";
  const offX = isLeft ? "-translate-x-6" : "translate-x-6";
  const hiddenClasses = `opacity-0 ${offX} scale-[0.98]`;
  const shownClasses = "opacity-100 translate-x-0 scale-100";

  return (
    <div
      role="alert"
      dir="rtl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={[
        "pointer-events-auto flex justify-between items-center gap-3 rounded-md px-4 py-4 shadow-lg max-w-[280px] min-w-[280px] bg-white",
        "transform transition-all duration-300 ease-out will-change-[transform,opacity]",
        shown ? shownClasses : hiddenClasses,
        typeStyles[type],
        className || "",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span
          className={`relative flex items-center justify-center border rounded-full p-1.5 ${iconWrapper[type]}`}
        >
          <CircularCountdown duration={duration} getRemaining={getRemaining} />
          {icon ?? typeIcons[type]}
        </span>

        <div className="text-sm font-medium max-w-md text-justify hyphens-auto">{children}</div>
      </div>

      {closable && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={requestClose}
          className="cursor-pointer rounded-md border inline-flex items-center justify-center p-[2px] opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 !text-[5px]"
        >
          {CloseIcon}
        </button>
      )}
    </div>
  );
};

export default Toast;
