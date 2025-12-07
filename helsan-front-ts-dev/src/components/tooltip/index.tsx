import React, {
  FC,
  ReactNode,
  ReactElement,
  HTMLAttributes,
  CSSProperties,
  useState,
  useRef,
  useEffect,
  cloneElement,
  isValidElement,
} from "react";

type TooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

type TooltipTrigger = "hover" | "click" | "focus";

interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tooltip content */
  title: ReactNode;
  /** Target element */
  children: ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger | TooltipTrigger[];
  disabled?: boolean;

  /** Controlled visibility */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Distance from trigger (px) */
  offset?: number;

  /** Extra class for tooltip box */
  contentClassName?: string;
}

/**
 * Usage (similar to Ant Design):
 * <Tooltip title="Edit" placement="top">
 *   <CustomButton icon={<EditIcon />} />
 * </Tooltip>
 */
const Tooltip: FC<TooltipProps> = ({
  title,
  children,
  placement = "top",
  trigger = "hover",
  disabled,
  open,
  defaultOpen,
  onOpenChange,
  offset = 8,
  className = "",
  contentClassName = "",
  ...rest
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(!!defaultOpen);
  const isControlled = open !== undefined;
  const visible = !disabled && (isControlled ? !!open : internalOpen);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  const setVisible = (next: boolean) => {
    if (disabled) return;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // Close on outside click when using "click" trigger
  useEffect(() => {
    if (!visible || !triggers.includes("click")) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, triggers]);

  let triggerNode: ReactNode = children;

  if (isValidElement(children)) {
    // After this cast, cloneElement knows it can accept event handlers, etc.
    const child = children as ReactElement<any>;
    const origProps = child.props as any;

    const extraProps: any = {};

    // Ensure focusable when using "focus" trigger
    if (triggers.includes("focus") && origProps.tabIndex == null) {
      extraProps.tabIndex = 0;
    }

    extraProps.onMouseEnter = (e: React.MouseEvent) => {
      if (triggers.includes("hover")) setVisible(true);
      origProps.onMouseEnter?.(e);
    };

    extraProps.onMouseLeave = (e: React.MouseEvent) => {
      if (triggers.includes("hover")) setVisible(false);
      origProps.onMouseLeave?.(e);
    };

    extraProps.onClick = (e: React.MouseEvent) => {
      if (triggers.includes("click")) setVisible(!visible);
      origProps.onClick?.(e);
    };

    extraProps.onFocus = (e: React.FocusEvent) => {
      if (triggers.includes("focus")) setVisible(true);
      origProps.onFocus?.(e);
    };

    extraProps.onBlur = (e: React.FocusEvent) => {
      if (triggers.includes("focus")) setVisible(false);
      origProps.onBlur?.(e);
    };

    extraProps["aria-describedby"] = visible
      ? "tooltip"
      : origProps["aria-describedby"];

    triggerNode = cloneElement(child, extraProps);
  } else {
    // Fallback wrapper for non-element children (e.g. plain text)
    const tabIndex = triggers.includes("focus") ? 0 : -1;

    triggerNode = (
      <span
        tabIndex={tabIndex}
        onMouseEnter={() => triggers.includes("hover") && setVisible(true)}
        onMouseLeave={() => triggers.includes("hover") && setVisible(false)}
        onClick={() => triggers.includes("click") && setVisible(!visible)}
        onFocus={() => triggers.includes("focus") && setVisible(true)}
        onBlur={() => triggers.includes("focus") && setVisible(false)}
      >
        {children}
      </span>
    );
  }

  const placementClass = getPlacementClass(placement);
  const placementStyle = getPlacementStyle(placement, offset);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      {...rest}
    >
      {triggerNode}

      {visible && title && (
        <div
          id="tooltip"
          role="tooltip"
          className={`
            pointer-events-none
            absolute
            z-[100000]
            px-2 py-1
            text-xs
            rounded-md
            bg-black
            text-white
            shadow-lg
            whitespace-nowrap
            ${placementClass}
            ${contentClassName}
          `}
          style={placementStyle}
        >
          {title}
        </div>
      )}
    </div>
  );
};

function getPlacementClass(placement: TooltipPlacement): string {
  // Alignment classes that do not depend on offset
  switch (placement) {
    case "top":
    case "bottom":
      return "left-1/2 -translate-x-1/2";
    case "left":
    case "right":
      return "top-1/2 -translate-y-1/2";
    case "top-start":
    case "bottom-start":
      return "left-0";
    case "top-end":
    case "bottom-end":
      return "right-0";
    default:
      return "left-1/2 -translate-x-1/2";
  }
}

function getPlacementStyle(
  placement: TooltipPlacement,
  offset: number
): CSSProperties {
  const gap = `calc(100% + ${offset}px)`;

  switch (placement) {
    case "top":
    case "top-start":
    case "top-end":
      return { bottom: gap };
    case "bottom":
    case "bottom-start":
    case "bottom-end":
      return { top: gap };
    case "left":
      return { right: gap };
    case "right":
      return { left: gap };
    default:
      return { bottom: gap };
  }
}

export default Tooltip;
