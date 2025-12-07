import { FC, ReactNode, useEffect } from "react";

type Placement = "right" | "left";

interface DrawerProps {
  className?: string;
  placement?: Placement;
  children: ReactNode;
  contentClassName?: string;
  showCloseIcon?: boolean;
  closeIcon?: ReactNode;
  open: boolean;
  /** Accepts number (px) or any CSS width string (e.g., "28rem", "80vw") */
  width?: number | string;
  onClose?: (open: boolean) => void;
  /** Close when pressing ESC (default: true) */
  escToClose?: boolean;
  /** Close when clicking backdrop (default: true) */
  backdropClosable?: boolean;
}

const toCssWidth = (w: number | string | undefined): string =>
  typeof w === "number" ? `${w}px` : w ?? "360px";

const Drawer: FC<DrawerProps> = ({
  className,
  placement = "right",
  children,
  contentClassName,
  showCloseIcon = true,
  closeIcon,
  open,
  width = 360,
  onClose,
  escToClose = true,
  backdropClosable = true,
}) => {
  // ESC key to close
  useEffect(() => {
    if (!escToClose || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [escToClose, open, onClose]);

  const panelBase =
    "fixed top-0 h-screen z-[1001] transition-transform duration-300 will-change-transform";
  const sideClass =
    placement === "right" ? "right-0" : "left-0";
  const translateClosed =
    placement === "right" ? "translate-x-full" : "-translate-x-full";
  const translateOpen = "translate-x-0";

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
        onClick={() => {
          if (open && backdropClosable) onClose?.(false);
        }}
      />

      {/* Panel */}
      <div
        className={[
          panelBase,
          sideClass,
          open ? translateOpen : translateClosed,
          className ?? "",
        ].join(" ")}
        style={{ width: toCssWidth(width) }}
        role="dialog"
        aria-modal="true"
      >
        {showCloseIcon && (
          <button
            type="button"
            className={[
              "absolute top-4",
              placement === "right" ? "left-4" : "right-4",
              "p-2 rounded hover:bg-black/5 focus:outline-none",
            ].join(" ")}
            onClick={() => onClose?.(false)}
            aria-label="Close"
          >
            {closeIcon ?? (
              <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden>
                <path d="M563.8 512l262.5-262.5a7.95 7.95 0 000-11.3l-40.5-40.5a7.95 7.95 0 00-11.3 0L512 460.2 249.5 197.7a7.95 7.95 0 00-11.3 0l-40.5 40.5a7.95 7.95 0 000 11.3L460.2 512 197.7 774.5a7.95 7.95 0 000 11.3l40.5 40.5a7.95 7.95 0 0011.3 0L512 563.8l262.5 262.5a7.95 7.95 0 0011.3 0l40.5-40.5a7.95 7.95 0 000-11.3L563.8 512z" />
              </svg>
            )}
          </button>
        )}

        <div
          className={[
            "h-full bg-white shadow-xl overflow-hidden",
            contentClassName ?? "",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
