import type { FC, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;          // icon / button / anything
  content?: ReactNode;          // number, text, or any ReactNode
  max?: number;                 // only used if content is a number
  showZero?: boolean;           // show "0" when content is 0 (if number)
  dot?: boolean;                // show small dot without content
  className?: string;           // wrapper extra classes
  badgeClassName?: string;      // badge extra classes
}

const Badge: FC<BadgeProps> = ({
  children,
  content,
  max = 99,
  showZero = false,
  dot = false,
  className = "",
  badgeClassName = "",
}) => {
  const isNumber = typeof content === "number";

  let displayContent: ReactNode = content;
  let hidden = false;

  if (dot) {
    // in dot mode we just show the dot if component is used
    hidden = false;
  } else if (isNumber) {
    const num = content as number;
    if (!showZero && num === 0) {
      hidden = true;
    } else {
      displayContent = num > max ? `${max}+` : num;
    }
  } else {
    // for text / other nodes: hide only if null/undefined/empty string
    if (content === null || content === undefined || content === "") {
      hidden = true;
    }
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}

      {!hidden && (
        <span
          className={`
            absolute -top-1 -right-2
            flex items-center justify-center
            ${dot ? "h-2 w-2" : "min-w-[1.1rem] h-4 px-1"}
            rounded-full
            bg-red-500 text-white
            text-[10px] leading-none
            shadow-sm
            ${badgeClassName}
          `}
        >
          {!dot && displayContent}
        </span>
      )}
    </div>
  );
};

export default Badge;
