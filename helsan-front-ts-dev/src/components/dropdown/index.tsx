import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type Placement =
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

type MenuAction = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

type MenuDivider = { type: "divider"; key: string };

export type DropdownItem = MenuAction | MenuDivider;

const isDivider = (it: DropdownItem): it is MenuDivider =>
  "type" in it && it.type === "divider";

type Trigger = "click" | "hover";

export interface DropdownProps {
  placement?: Placement;
  trigger?: Trigger;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  menu: { items: DropdownItem[] };
  onSelect?: (item: Exclude<DropdownItem, { type: "divider" }>) => void;
  className?: string; // wrapper
  panelClassName?: string; // popup panel
  disabled?: boolean;
  children: React.ReactNode; // trigger (button/link/etc.)

  /** highlight selected item */
  activeKey?: string;

  /** customize trigger button size/styles */
  triggerClassName?: string;

  /** render popup into document.body */
  usePortal?: boolean;
}

const placementToClasses: Record<Placement, string> = {
  bottomLeft: "top-full left-0 mt-2 origin-top-left",
  bottomRight: "top-full right-0 mt-2 origin-top-right",
  topLeft: "bottom-full left-0 mb-2 origin-bottom-left",
  topRight: "bottom-full right-0 mb-2 origin-bottom-right",
  leftTop: "right-full top-0 mr-2 origin-top-right",
  leftBottom: "right-full bottom-0 mr-2 origin-bottom-right",
  rightTop: "left-full top-0 ml-2 origin-top-left",
  rightBottom: "left-full bottom-0 ml-2 origin-bottom-left",
};

const placementToOrigin: Record<Placement, string> = {
  bottomLeft: "origin-top-left",
  bottomRight: "origin-top-right",
  topLeft: "origin-bottom-left",
  topRight: "origin-bottom-right",
  leftTop: "origin-top-right",
  leftBottom: "origin-bottom-right",
  rightTop: "origin-top-left",
  rightBottom: "origin-bottom-left",
};

export const Dropdown: React.FC<DropdownProps> = ({
  placement = "bottomLeft",
  trigger = "click",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  menu,
  onSelect,
  className,
  panelClassName,
  disabled,
  children,
  activeKey,
  triggerClassName,
  usePortal = false,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : uncontrolledOpen;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const items = menu.items;
  const actionableIndexes = useMemo(
    () =>
      items.map((it, idx) => ("type" in it ? -1 : idx)).filter((i) => i !== -1),
    [items]
  );

  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) return;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [disabled, isControlled, onOpenChange]
  );

  // --- compute portal position ---
  useEffect(() => {
    if (!usePortal || !open) return;
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = 0; // like mt-2 / mb-2

    let top = rect.bottom + scrollY + offset;
    let left = rect.left + scrollX;

    switch (placement) {
      case "bottomLeft":
        top = rect.bottom + scrollY + offset;
        left = rect.left + scrollX;
        break;
      case "bottomRight":
        top = rect.bottom + scrollY + offset;
        left = rect.right + scrollX;
        break;
      case "topLeft":
        top = rect.top + scrollY - offset;
        left = rect.left + scrollX;
        break;
      case "topRight":
        top = rect.top + scrollY - offset;
        left = rect.right + scrollX;
        break;
      case "leftTop":
        top = rect.top + scrollY;
        left = rect.left + scrollX - offset;
        break;
      case "leftBottom":
        top = rect.bottom + scrollY;
        left = rect.left + scrollX - offset;
        break;
      case "rightTop":
        top = rect.top + scrollY;
        left = rect.right + scrollX + offset;
        break;
      case "rightBottom":
        top = rect.bottom + scrollY;
        left = rect.right + scrollX + offset;
        break;
      default:
        break;
    }

    setPosition({ top, left });
  }, [usePortal, open, placement]);

  // --- outside click / escape to close ---
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const root = wrapperRef.current;
      const menuEl = menuRef.current;

      // Click inside trigger or inside menu → ignore
      if (root?.contains(target as Node) || menuEl?.contains(target as Node)) {
        return;
      }

      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  // --- trigger behavior ---
  const triggerProps = useMemo(() => {
    if (trigger === "hover") {
      return {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: (e: React.MouseEvent) => {
          const rel = e.relatedTarget as Node | null;
          const menuEl = menuRef.current;
          // if moving to the menu, don't close
          if (
            wrapperRef.current?.contains(rel as Node) ||
            menuEl?.contains(rel as Node)
          ) {
            return;
          }
          setOpen(false);
        },
      } as const;
    }
    return {
      onClick: () => setOpen(!open),
    } as const;
  }, [trigger, setOpen, open]);

  // --- keyboard navigation within menu ---
  const focusItemAt = (i: number) => {
    const el = itemRefs.current[i];
    el?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = itemRefs.current.findIndex(
      (el) => el === document.activeElement
    );
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next =
        actionableIndexes[
          (actionableIndexes.indexOf(currentIndex) + 1) %
            actionableIndexes.length
        ];
      if (next != null) focusItemAt(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = actionableIndexes.indexOf(currentIndex);
      const prev =
        actionableIndexes[
          (idx - 1 + actionableIndexes.length) % actionableIndexes.length
        ];
      if (prev != null) focusItemAt(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItemAt(actionableIndexes[0] ?? 0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItemAt(actionableIndexes[actionableIndexes.length - 1] ?? 0);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => {
        const first = actionableIndexes[0];
        if (first != null) focusItemAt(first);
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [open, actionableIndexes.join(",")]);

  const portalContainer =
    typeof document !== "undefined" ? document.body : null;

  // --- popup content (used for both portal & non-portal) ---
  const popup = (
    <div
      ref={menuRef}
      role="menu"
      aria-hidden={!open}
      onKeyDown={onMenuKeyDown}
      style={
        usePortal && position
          ? {
              top: position.top,
              left: position.left,
            }
          : undefined
      }
      className={`
        ${usePortal ? "fixed" : "absolute"}
        z-[100000] min-w-44
        ${
          usePortal
            ? placementToOrigin[placement]
            : placementToClasses[placement]
        }
        ${
          open
            ? "pointer-events-auto opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-95"
        }
        transition transform duration-150 ease-out
      `}
      // Hover support when menu is in portal
      onMouseEnter={
        trigger === "hover"
          ? () => {
              if (!open) setOpen(true);
            }
          : undefined
      }
      onMouseLeave={
        trigger === "hover"
          ? (e) => {
              const rel = e.relatedTarget as Node | null;
              if (
                wrapperRef.current?.contains(rel as Node) ||
                menuRef.current?.contains(rel as Node)
              ) {
                return;
              }
              setOpen(false);
            }
          : undefined
      }
    >
      <div
        className={`
          overflow-hidden rounded-xl border border-gray-200
          bg-white shadow-lg
          ${panelClassName ?? ""}
        `}
      >
        <ul className="max-h-72 overflow-auto py-1">
          {items.map((item, idx) => {
            if (isDivider(item)) {
              return (
                <li key={item.key} className="my-1 border-t border-gray-200" />
              );
            }

            const action: MenuAction = item;
            const isDisabled = !!action.disabled;
            const isActive = activeKey != null && activeKey === action.key;

            const baseClass =
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition focus:outline-none hover:bg-gray-50 disabled:opacity-50";
            const dangerClass = action.danger
              ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
              : "text-gray-800";
            const activeClass = isActive
              ? " bg-gray-100 font-semibold"
              : " cursor-pointer";

            return (
              <li key={action.key}>
                <button
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  role="menuitem"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    onSelect?.(action);
                    setOpen(false); // <-- selection closes normally
                    buttonRef.current?.focus();
                  }}
                  className={`${baseClass} ${dangerClass} ${activeClass}`}
                >
                  {action.icon && (
                    <span className="shrink-0">{action.icon}</span>
                  )}
                  <span className="truncate">{action.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className ?? ""}`}
    >
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-md text-sm font-medium
          hover:bg-gray-50 focus:outline-none
          disabled:opacity-50
          ${triggerClassName ?? ""}
        `}
        {...triggerProps}
      >
        {children}
      </button>

      {/* Popup or Portal */}
      {usePortal && portalContainer
        ? createPortal(popup, portalContainer)
        : popup}
    </div>
  );
};
