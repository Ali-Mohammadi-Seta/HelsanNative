import React, { useCallback, useMemo } from "react";

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
};

export type RatingFieldProps = {
  value?: number; // controlled
  defaultValue?: number; // uncontrolled
  onChange?: (val: number) => void;

  max?: number; // default 5
  halfRating?: boolean; // default true
  disabled?: boolean; // default false

  icon: React.ReactElement<IconProps>;

  className?: string; // filled color/classes
  emptyClassName?: string; // empty color/classes
  size?: number; // px, default 20
  ariaLabel?: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/** Renders one star: empty layer + clipped filled layer */
function StarLayer({
  icon,
  isFull,
  isHalf,
  className,
  emptyClassName,
  size,
}: {
  icon: React.ReactElement<IconProps>;
  isFull: boolean;
  isHalf: boolean;
  className?: string;
  emptyClassName?: string;
  size: number;
}) {
  // Ensure react-icons (or any SVG) respects our sizing
  const baseProps: IconProps = {
    size,
    style: { display: "block", width: "100%", height: "100%" },
  };

  return (
    <span
      className="relative inline-block leading-none align-middle cursor-pointer"
      style={{ width: size, height: size }}
    >
      {/* Empty/background */}
      <span className="absolute inset-0">
        {React.cloneElement(icon, {
          ...baseProps,
          className: emptyClassName,
        })}
      </span>

      {/* Filled/foreground (full or half via clipPath) */}
      <span
        className="absolute inset-0"
        style={{
          // left-to-right fill; for RTL swap the inset sides
          clipPath: isHalf ? "inset(0 0 0 50%)" : undefined,
        }}
      >
        {(isFull || isHalf) &&
          React.cloneElement(icon, {
            ...baseProps,
            className,
          })}
      </span>
    </span>
  );
}

const RatingField: React.FC<RatingFieldProps> = ({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  halfRating = false,
  disabled = false,
  icon,
  className = "text-yellow-400",
  emptyClassName = "text-gray-300 opacity-70",
  size = 20,
  ariaLabel = "Rating",
}) => {
  const current = useMemo(() => {
    const v = value ?? defaultValue;
    if (!Number.isFinite(v)) return 0;
    return clamp(v, 0, max);
  }, [value, defaultValue, max]);

  const full = Math.floor(current);
  const fractional = current - full;
  const hasHalf = halfRating && fractional >= 0.5 - 1e-6;

  const handleClick = useCallback(
    (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      let next = idx + 1;
      if (halfRating) {
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeft = e.clientX - rect.left < rect.width / 2;
        next = idx + (isLeft ? 0.5 : 1);
      }
      onChange?.(clamp(next, 0, max));
    },
    [disabled, halfRating, max, onChange]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const step = halfRating ? 0.5 : 1;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange?.(clamp(current + step, 0, max));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange?.(clamp(current - step, 0, max));
      } else if (e.key === "Home") {
        e.preventDefault();
        onChange?.(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onChange?.(max);
      }
    },
    [current, disabled, halfRating, max, onChange]
  );

  return (
    <div
      className="flex items-center gap-1 select-none"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Number(current.toFixed(2))}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKey}
      style={{ cursor: disabled ? "default" : "pointer", lineHeight: 0 }}
    >
      {Array.from({ length: max }).map((_, i) => {
        const isFull = i < full;
        const isHalf = !isFull && hasHalf && i === full;

        return (
          <button
            type="button"
            key={i}
            onClick={(e) => handleClick(i, e)}
            disabled={disabled}
            aria-label={`${ariaLabel}: ${isHalf ? i + 0.5 : i + 1}`}
            className="p-0 m-0 bg-transparent border-0"
            style={{ width: size, height: size, lineHeight: 0 }}
          >
            <StarLayer
              icon={icon}
              isFull={isFull}
              isHalf={isHalf}
              className={className}
              emptyClassName={emptyClassName}
              size={size}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingField;
