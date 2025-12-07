import React, { useState, useEffect, ReactNode, CSSProperties } from "react";

// Define allowed sizes specifically to match the sizeClasses keys
type SpinSize = "small" | "default" | "large";

interface SpinProps {
  spinning?: boolean;
  size?: SpinSize;
  tip?: ReactNode;
  delay?: number;
  wrapperClassName?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const Spin: React.FC<SpinProps> = ({
  spinning = true,
  size = "default",
  tip = null,
  delay = 0,
  wrapperClassName = "",
  className = "",
  style = {},
  children = null,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(spinning);

  // Handle the 'delay' prop logic (debounce the spinner appearance)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (spinning) {
      timeout = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(false);
    }

    return () => clearTimeout(timeout);
  }, [spinning, delay]);

  // Map sizes to your Tailwind classes
  // Explicitly typing the Record ensures strict adherence to SpinSize keys
  const sizeClasses: Record<SpinSize, { container: string; dot: string }> = {
    small: {
      container: "w-4 gap-[1px]",
      dot: "w-1.5 h-1.5",
    },
    default: {
      container: "w-7 gap-[2px]",
      dot: "w-3 h-3",
    },
    large: {
      container: "w-12 gap-[3px]",
      dot: "w-5 h-5",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  // The actual custom indicator (Your grid)
  const spinnerElement = (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={style}
    >
      <div
        className={`grid grid-cols-2 animate-spin duration-500 ${currentSize.container}`}
      >
        <div className={`${currentSize.dot} rounded-full bg-blue-400`} />
        <div className={`${currentSize.dot} rounded-full bg-green-400`} />
        <div className={`${currentSize.dot} rounded-full bg-green-400`} />
        <div className={`${currentSize.dot} rounded-full bg-blue-400`} />
      </div>
      {tip && <div className="mt-2 text-blue-500 text-sm">{tip}</div>}
    </div>
  );

  // SCENARIO 1: Wrapper Mode (Has children)
  // Renders children with an opacity blur when spinning
  if (children) {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <div
          className={`transition-opacity duration-300 ${
            isVisible
              ? "opacity-50 user-select-none pointer-events-none blur-[1px]"
              : ""
          }`}
        >
          {children}
        </div>
        {isVisible && (
          <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full max-h-full">
            {spinnerElement}
          </div>
        )}
      </div>
    );
  }

  // SCENARIO 2: Standalone Mode
  // If not spinning, return null (standard Antd behavior)
  if (!isVisible) return null;

  return spinnerElement;
};

export default Spin;