import React, {
  useEffect,
  useRef,
  useCallback,
  PropsWithChildren,
  forwardRef,
  useId,
  CSSProperties,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export type ModalProps = PropsWithChildren<{
  open: boolean;

  // Event handlers (optional MouseEvent)
  onClose?: (e?: React.MouseEvent) => void;
  onCancel?: (e?: React.MouseEvent) => void; // AntD alias
  onOk?: (e?: React.MouseEvent) => void; // Handler for the default OK button

  title?: string;
  footer?: React.ReactNode;

  okText?: React.ReactNode;
  cancelText?: React.ReactNode;

  // Behavior
  destroyOnClose?: boolean; // Unmount children on close
  showClose?: boolean;
  closable?: boolean; // AntD alias
  closeOnOverlayClick?: boolean;
  maskClosable?: boolean; // AntD alias
  centered?: boolean;

  // Sizing
  size?: ModalSize;
  width?: number | string; // AntD alias

  // Accessibility & Advanced
  ariaLabel?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  disableScrollLock?: boolean;
  container?: Element | null;
  dir?: "rtl" | "ltr";

  // Styling
  containerClassName?: string; // legacy name (still supported)
}>;

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[min(90vw,72rem)]",
};

function usePortalTarget(
  rootId = "react-portal-root",
  container?: Element | null
) {
  const canUseDOM = typeof window !== "undefined" && !!window.document;
  return useCallback(() => {
    if (!canUseDOM) return null;
    if (container) return container;
    let el = document.getElementById(rootId);
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", rootId);
      document.body.appendChild(el);
    }
    return el;
  }, [canUseDOM, container, rootId])();
}

function ModalComp({
  open,
  onClose,
  onCancel,
  onOk,
  title,
  size = "md",
  width,
  showClose = true,
  closable,
  closeOnOverlayClick = true,
  maskClosable,
  centered = true,
  destroyOnClose = true,
  container,
  footer,
  okText = "OK",
  cancelText = "Cancel",
  initialFocusRef,
  disableScrollLock = false,
  children,
  dir = "rtl",
  containerClassName,
  ariaLabel,
}: ModalProps) {
  const portalTarget = usePortalTarget("modal-root", container);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const labelId = useId();
  const descId = useId();

  // Animation state
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Prop Unification for AntD compatibility
  const handleClose = onCancel || onClose;
  const shouldShowClose = closable ?? showClose;
  const shouldCloseOnOverlayClick = maskClosable ?? closeOnOverlayClick;

  // Handle mount/unmount with animation
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      lastActiveRef.current = (document.activeElement as HTMLElement) ?? null;
      if (!disableScrollLock) {
        document.body.style.overflow = "hidden";
      }
    }
    return () => {
      if (!disableScrollLock) {
        document.body.style.overflow = "";
      }
      lastActiveRef.current?.focus?.();
    };
  }, [open, disableScrollLock]);

  // Focus management & ESC key handling
  useEffect(() => {
    if (!open) return;
    const toFocus = initialFocusRef?.current ?? dialogRef.current;
    const id = window.setTimeout(() => toFocus?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose?.();
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose, initialFocusRef]);

  // Handle `destroyOnClose`: unmount completely when not open
  if (destroyOnClose && !shouldRender) {
    return null;
  }
  if (!portalTarget) {
    return null;
  }

  const labelledBy = title ? `modal-title-${labelId}` : undefined;
  const describedBy = `modal-desc-${descId}`;

  const dialogStyle: CSSProperties = {};
  if (width) {
    dialogStyle.maxWidth = typeof width === "number" ? `${width}px` : width;
  }

  // --- Footer Logic ---
  const renderFooter = () => {
    if (footer !== undefined) return footer;
    if (onOk) {
      return (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={(e) => handleClose?.(e)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={(e) => onOk(e)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none"
          >
            {okText}
          </button>
        </div>
      );
    }
    return null;
  };

  const finalFooter = renderFooter();

  return createPortal(
    <div
      className={!destroyOnClose && !shouldRender ? "pointer-events-none" : ""}
    >
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity duration-200 !max-w-[100vw]",
          isVisible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden="true"
        onClick={(e) => {
          if (shouldCloseOnOverlayClick) handleClose?.(e);
        }}
      />

      {/* Dialog Wrapper */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        ref={dialogRef}
        tabIndex={-1}
        className={[
          "fixed inset-0 z-[1000] p-4 overflow-y-auto transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0",
          centered
            ? "grid place-items-center"
            : "flex justify-center items-start",
        ].join(" ")}
        onClick={(e) => {
          if (e.target === e.currentTarget && shouldCloseOnOverlayClick)
            handleClose?.(e);
        }}
      >
        {/* Dialog Content */}
        <div
          dir={dir}
          style={dialogStyle}
          className={[
            "w-full rounded-2xl bg-white text-zinc-900 shadow-2xl ring-1 ring-zinc-200",
            "transition-all duration-200 ease-out",
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4",
            !width ? sizeClasses[size] : "",
            containerClassName, // legacy support
          ]
            .join(" ")
            .trim()}
          onClick={(e) => e.stopPropagation()}
        >
          {title || shouldShowClose ? (
            <Header>
              <Title id={labelledBy}>{title}</Title>
              {shouldShowClose && (
                <button
                  onClick={(e) => handleClose?.(e)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-md px-2 py-1 text-sm hover:bg-zinc-100"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              )}
            </Header>
          ) : null}

          <Body id={describedBy}>{children}</Body>

          {finalFooter !== null ? <Footer>{finalFooter}</Footer> : null}
        </div>
      </div>
    </div>,
    portalTarget
  );
}

// --- Structural Subcomponents ---

const Header = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ className?: string }>
>(function Header({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={`flex items-start justify-between gap-3 p-5 border-b border-zinc-200 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
});

const Title = forwardRef<
  HTMLHeadingElement,
  PropsWithChildren<{ className?: string; id?: string }>
>(function Title({ children, className, id }, ref) {
  return (
    <h2
      ref={ref}
      id={id}
      className={`text-lg font-semibold ${className ?? ""}`}
    >
      {children}
    </h2>
  );
});

const Body = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ className?: string; id?: string }>
>(function Body({ children, className, id }, ref) {
  return (
    <div ref={ref} id={id} className={`p-5 ${className ?? ""}`}>
      {children}
    </div>
  );
});

const Footer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ className?: string }>
>(function Footer({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={`p-5 border-t border-zinc-200 ${className ?? ""}`}
    >
      {children}
    </div>
  );
});

// Attach statics
export const Modal = Object.assign(ModalComp, {
  Header,
  Title,
  Body,
  Footer,
});
