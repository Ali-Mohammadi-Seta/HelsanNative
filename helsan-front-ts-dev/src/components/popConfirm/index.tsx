import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import CustomButton from "../button";

type PlacementType =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

interface OkButtonProps {
  loading?: boolean;
  className?: string;
  [key: string]: any; // For additional props
}

interface PopupPosition {
  top: number;
  left: number;
}
type TriggerElement = React.ReactElement<{
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}>;
interface PopConfirmProps {
  children: TriggerElement;
  wrapperClassName?: string;
  popUpClassName?: string;
  titleClassName?: string;
  description?: string;
  desciptionClassName?: string; // Keeping for backward compatibility
  descriptionClassName?: string;
  title?: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  placement?: PlacementType;
  disabled?: boolean;
  okButtonProps?: OkButtonProps;
  okTextKey?: string;
  cancelTextKey?: string;
  // Optional controlled props (for advanced use cases)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Z-index prop
  zIndex?: number;
}

const PopConfirm: React.FC<PopConfirmProps> = ({
  children,
  wrapperClassName,
  popUpClassName,
  titleClassName,
  description = "",
  desciptionClassName,
  descriptionClassName,
  title = "",
  okText,
  cancelText,
  onOk,
  onCancel,
  onConfirm,
  placement = "top",
  disabled = false,
  okButtonProps = {},
  okTextKey,
  cancelTextKey,
  // Optional controlled props (for advanced use cases)
  open: controlledOpen,
  onOpenChange,
  // Z-index prop
  zIndex = 1070,
}) => {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({
    top: 0,
    left: 0,
  });
  const [isPositioned, setIsPositioned] = useState<boolean>(false); // Track if position is calculated
  const popupRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef<boolean>(false);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const openPopUp = isControlled ? controlledOpen : internalOpen;

  const okButtonText = okText || (okTextKey ? t(okTextKey) : t("ok", "Ok"));
  const cancelButtonText =
    cancelText || (cancelTextKey ? t(cancelTextKey) : t("cancel", "Cancel"));
  const handleOk = onOk || onConfirm;

  // Calculate initial position BEFORE opening
  const calculateInitialPosition = useCallback((): PopupPosition => {
    if (!wrapperRef.current) return { top: 0, left: 0 };

    const rect = wrapperRef.current.getBoundingClientRect();
    const triggerX = rect.left;
    const triggerY = rect.top;
    const triggerWidth = rect.width;
    const triggerHeight = rect.height;

    // Use estimated dimensions for initial positioning
    const estimatedWidth = 250;
    const estimatedHeight = 150;
    const spacing = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerY - estimatedHeight - spacing;
        left = triggerX + triggerWidth / 2 - estimatedWidth / 2;
        break;
      case "bottom":
        top = triggerY + triggerHeight + spacing;
        left = triggerX + triggerWidth / 2 - estimatedWidth / 2;
        break;
      case "left":
        top = triggerY + triggerHeight / 2 - estimatedHeight / 2;
        left = triggerX - estimatedWidth - spacing;
        break;
      case "right":
        top = triggerY + triggerHeight / 2 - estimatedHeight / 2;
        left = triggerX + triggerWidth + spacing;
        break;
      case "topLeft":
        top = triggerY - estimatedHeight - spacing;
        left = triggerX;
        break;
      case "topRight":
        top = triggerY - estimatedHeight - spacing;
        left = triggerX + triggerWidth - estimatedWidth;
        break;
      case "bottomLeft":
        top = triggerY + triggerHeight + spacing;
        left = triggerX;
        break;
      case "bottomRight":
        top = triggerY + triggerHeight + spacing;
        left = triggerX + triggerWidth - estimatedWidth;
        break;
      default:
        top = triggerY - estimatedHeight - spacing;
        left = triggerX + triggerWidth / 2 - estimatedWidth / 2;
    }

    return { top, left };
  }, [placement]);

  // Calculate precise position after render
  const calculatePosition = useCallback((): void => {
    if (!wrapperRef.current) return;

    // Get actual popup dimensions if available, otherwise use defaults
    const popupElement = popupRef.current;
    const popupWidth = popupElement?.offsetWidth || 250;
    const popupHeight = popupElement?.offsetHeight || 150;
    const spacing = 8;

    // Always use wrapper element for positioning
    const rect = wrapperRef.current.getBoundingClientRect();
    const triggerX = rect.left;
    const triggerY = rect.top;
    const triggerWidth = rect.width;
    const triggerHeight = rect.height;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerY - popupHeight - spacing;
        left = triggerX + triggerWidth / 2 - popupWidth / 2;
        break;
      case "bottom":
        top = triggerY + triggerHeight + spacing;
        left = triggerX + triggerWidth / 2 - popupWidth / 2;
        break;
      case "left":
        top = triggerY + triggerHeight / 2 - popupHeight / 2;
        left = triggerX - popupWidth - spacing;
        break;
      case "right":
        top = triggerY + triggerHeight / 2 - popupHeight / 2;
        left = triggerX + triggerWidth + spacing;
        break;
      case "topLeft":
        top = triggerY - popupHeight - spacing;
        left = triggerX;
        break;
      case "topRight":
        top = triggerY - popupHeight - spacing;
        left = triggerX + triggerWidth - popupWidth;
        break;
      case "bottomLeft":
        top = triggerY + triggerHeight + spacing;
        left = triggerX;
        break;
      case "bottomRight":
        top = triggerY + triggerHeight + spacing;
        left = triggerX + triggerWidth - popupWidth;
        break;
      default:
        top = triggerY - popupHeight - spacing;
        left = triggerX + triggerWidth / 2 - popupWidth / 2;
    }

    // Ensure popup stays within viewport
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    // Adjust horizontal position
    if (left < padding) {
      left = padding;
    } else if (left + popupWidth > viewportWidth - padding + scrollX) {
      left = viewportWidth - popupWidth - padding + scrollX;
    }

    // Adjust vertical position - flip if necessary
    if (top < padding + scrollY) {
      // If it doesn't fit on top, try bottom
      if (
        placement === "top" ||
        placement === "topLeft" ||
        placement === "topRight"
      ) {
        top = triggerY + triggerHeight + spacing;
      } else {
        top = padding + scrollY;
      }
    } else if (top + popupHeight > viewportHeight - padding + scrollY) {
      // If it doesn't fit on bottom, try top
      if (
        placement === "bottom" ||
        placement === "bottomLeft" ||
        placement === "bottomRight"
      ) {
        top = triggerY - popupHeight - spacing;
      } else {
        top = viewportHeight - popupHeight - padding + scrollY;
      }
    }

    setPopupPosition({ top, left });
    setIsPositioned(true);
  }, [placement]);

  // Update open state (controlled or uncontrolled)
  const updateOpenState = (newOpen: boolean): void => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  // Handle opening with animation
  const handleOpen = (
    event?: MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ): void => {
    if (disabled) return;

    // Stop event propagation to prevent conflicts
    event?.stopPropagation?.();

    // Calculate initial position BEFORE opening
    const initialPos = calculateInitialPosition();
    setPopupPosition(initialPos);
    setIsPositioned(false); // Will be set to true after precise calculation

    updateOpenState(true);
    setIsAnimating(true);
    isClosingRef.current = false;

    // Start animation after a frame
    requestAnimationFrame(() => {
      setIsAnimating(false);
    });
  };

  // Handle closing with animation
  const handleClose = (): void => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    setIsAnimating(true);
    setTimeout(() => {
      updateOpenState(false);
      setIsAnimating(false);
      setIsPositioned(false);
      isClosingRef.current = false;
    }, 200);
  };

  // Recalculate position when popup opens or on scroll/resize
  useEffect(() => {
    if (openPopUp && popupRef.current) {
      // Recalculate position once popup is rendered
      calculatePosition();

      const handleUpdate = (): void => calculatePosition();

      // Listen to scroll on window and all parent elements
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [openPopUp, calculatePosition]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent): void => {
      if (isClosingRef.current) return;

      if (
        openPopUp &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (openPopUp) {
      // Use a small delay to prevent immediate close on open
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openPopUp]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && openPopUp) {
        handleClose();
      }
    };

    if (openPopUp) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [openPopUp]);

  // Popup content component
  const popupContent = openPopUp && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: zIndex - 10 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          handleClose();
        }}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`
          ${popUpClassName ?? ""}
          fixed
          bg-white
          shadow-2xl
          px-5
          py-3
          rounded-lg
          transition-all
          duration-200
          ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
        style={{
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`,
          zIndex: zIndex,
          transformOrigin:
            placement === "top"
              ? "center bottom"
              : placement === "bottom"
              ? "center top"
              : placement === "left"
              ? "right center"
              : placement === "right"
              ? "left center"
              : placement === "topLeft"
              ? "left bottom"
              : placement === "topRight"
              ? "right bottom"
              : placement === "bottomLeft"
              ? "left top"
              : placement === "bottomRight"
              ? "right top"
              : "center bottom",
          minWidth: "250px",
          maxWidth: "90vw",
          // Hide popup initially until position is calculated
          visibility:
            isPositioned || popupPosition.top !== 0 ? "visible" : "hidden",
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {(title || description) && (
          <div>
            {title && (
              <p className={`font-semibold text-sm ${titleClassName ?? ""}`}>
                {title}
              </p>
            )}
            {description && (
              <p
                className={`mt-2 text-xs text-gray-500 ${
                  descriptionClassName || desciptionClassName || ""
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <CustomButton
            type="danger"
            variant="solid"
            size="small"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              handleClose();
              onCancel && onCancel();
            }}
          >
            {cancelButtonText}
          </CustomButton>
          <CustomButton
            type="primary"
            variant="solid"
            size="small"
            loading={okButtonProps.loading}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              if (!okButtonProps.loading) {
                handleClose();
                handleOk && handleOk();
              }
            }}
            {...(okButtonProps.className && {
              className: okButtonProps.className,
            })}
          >
            {okButtonText}
          </CustomButton>
        </div>
      </div>
    </>
  );

  // Clone children to intercept click events
  const clonedChildren = React.cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      // Call original onClick if exists
      children.props.onClick?.(e);
      // Open popup
      handleOpen(e);
    },
  });

  return (
    <div
      ref={wrapperRef}
      className={`${wrapperClassName ?? ""} relative inline-block`}
    >
      {clonedChildren}

      {openPopUp && createPortal(popupContent, document.body)}
    </div>
  );
};

export default PopConfirm;
