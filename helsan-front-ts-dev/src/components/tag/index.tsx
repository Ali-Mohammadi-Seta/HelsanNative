import React, { useMemo } from "react";

// ---------- utilities ----------
const cx = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(" ");

export type PresetColor =
  | "magenta"
  | "red"
  | "volcano"
  | "orange"
  | "gold"
  | "lime"
  | "green"
  | "cyan"
  | "blue"
  | "geekblue"
  | "purple"
  | "default";

export type TagSize = "small" | "middle" | "large";
export type TagVariant = "solid" | "light" | "outline";
export type TagShape = "round" | "pill";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: PresetColor | string; // preset or custom
  size?: TagSize;
  variant?: TagVariant;
  shape?: TagShape;
  bordered?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface CheckableTagProps
  extends Omit<
    TagProps,
    "closable" | "onClose" | "variant" | "icon" | "closeIcon" | "onChange"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fired when the checked state toggles */
  onCheckedChange?: (checked: boolean) => void;
}

const PRESET_HEX: Record<PresetColor, string> = {
  magenta: "#eb2f96",
  red: "#ff4d4f",
  volcano: "#fa541c",
  orange: "#fa8c16",
  gold: "#faad14",
  lime: "#a0d911",
  green: "#52c41a",
  cyan: "#13c2c2",
  blue: "#1677ff",
  geekblue: "#2f54eb",
  purple: "#722ed1",
  default: "#d9d9d9",
};

function parseColor(color?: PresetColor | string): string {
  if (!color) return PRESET_HEX.default;
  if (
    (Object.keys(PRESET_HEX) as PresetColor[]).includes(color as PresetColor)
  ) {
    return PRESET_HEX[color as PresetColor];
  }
  return color; // custom string
}

function hexWithAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const to255 = (s: string) => parseInt(s.length === 1 ? s + s : s, 16);
  const r = to255(h.slice(0, h.length === 3 ? 1 : 2));
  const g = to255(h.slice(h.length === 3 ? 1 : 2, h.length === 3 ? 2 : 4));
  const b = to255(h.slice(h.length === 3 ? 2 : 4, h.length === 3 ? 3 : 6));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function computeStyles(
  color: string,
  variant: TagVariant,
  bordered: boolean
): { bg?: string; text?: string; border?: string } {
  const isHex = color.startsWith("#");
  const textOnSolid = "white";

  if (variant === "solid") {
    return {
      bg: color,
      text: textOnSolid,
      border: bordered ? color : "transparent",
    };
  }
  if (variant === "outline") {
    return { bg: "transparent", text: color, border: color };
  }
  // light
  return {
    bg: isHex ? hexWithAlpha(color, 0.15) : color,
    text: color,
    border: bordered
      ? isHex
        ? hexWithAlpha(color, 0.35)
        : color
      : "transparent",
  };
}

const sizeMap: Record<
  TagSize,
  { pad: string; text: string; radius: string; icon: string }
> = {
  small: {
    pad: "px-2 py-0.5",
    text: "text-xs",
    radius: "rounded",
    icon: "text-xs",
  },
  middle: {
    pad: "px-2.5 py-0.5",
    text: "text-sm",
    radius: "rounded-md",
    icon: "text-sm",
  },
  large: {
    pad: "px-3 py-1",
    text: "text-base",
    radius: "rounded-lg",
    icon: "text-base",
  },
};

// ---------- Base Tag ----------
const TagBase: React.FC<TagProps> = ({
  color = "default",
  size = "middle",
  variant = "light",
  shape = "round",
  bordered = false,
  icon,
  closable,
  closeIcon,
  onClose,
  className,
  children,
  style,
  ...rest
}) => {
  const colorStr = useMemo(() => parseColor(color), [color]);
  const styles = useMemo(
    () => computeStyles(colorStr, variant, bordered),
    [colorStr, variant, bordered]
  );
  const s = sizeMap[size];

  return (
    <span
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-1 select-none align-middle",
        s.pad,
        s.text,
        shape === "pill" ? "rounded-full" : s.radius,
        "border",
        className
      )}
      style={{
        background: styles.bg,
        color: styles.text,
        borderColor: styles.border,
        ...style,
      }}
    >
      {icon && (
        <span className={cx("inline-flex items-center", s.icon)}>{icon}</span>
      )}
      {children}
      {closable && (
        <button
          type="button"
          aria-label="close"
          className={cx(
            "ml-1 inline-flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer",
            "opacity-75 hover:opacity-100 focus:outline-none"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.(e);
          }}
        >
          {closeIcon ?? (
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden
            >
              <path d="M563.8 512l262.5-262.5a7.95 7.95 0 000-11.3l-40.5-40.5a7.95 7.95 0 00-11.3 0L512 460.2 249.5 197.7a7.95 7.95 0 00-11.3 0l-40.5 40.5a7.95 7.95 0 000 11.3L460.2 512 197.7 774.5a7.95 7.95 0 000 11.3l40.5 40.5a7.95 7.95 0 0011.3 0L512 563.8l262.5 262.5a7.95 7.95 0 0011.3 0l40.5-40.5a7.95 7.95 0 000-11.3L563.8 512z"></path>
            </svg>
          )}
        </button>
      )}
    </span>
  );
};

// ---------- Checkable Tag ----------
const CheckableTag: React.FC<CheckableTagProps> = ({
  checked,
  defaultChecked,
  onCheckedChange,
  onClick,
  className,
  color = "blue",
  size = "middle",
  shape = "round",
  children,
  style,
  ...rest
}) => {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? !!checked : internal;

  const baseColor = parseColor(color);
  const variant: TagVariant = isChecked ? "solid" : "light";
  const bordered = !isChecked;
  const styles = computeStyles(baseColor, variant, bordered);
  const s = sizeMap[size];

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <span
      role="switch"
      aria-checked={isChecked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      {...rest}
      className={cx(
        "inline-flex items-center gap-1 select-none align-middle cursor-pointer",
        s.pad,
        s.text,
        shape === "pill" ? "rounded-full" : s.radius,
        "border",
        className
      )}
      style={{
        background: styles.bg,
        color: styles.text,
        borderColor: styles.border,
        ...style,
      }}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
    >
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};

// ---------- Compose & export with static ----------
const Tag = Object.assign(TagBase, { CheckableTag }) as React.FC<TagProps> & {
  CheckableTag: React.FC<CheckableTagProps>;
};

export default Tag;
export { CheckableTag };
