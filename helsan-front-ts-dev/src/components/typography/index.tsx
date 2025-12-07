// Typography.tsx
import type { FC, ReactNode, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

type Level = 1 | 2 | 3 | 4 | 5;

interface TypographyProps {
  className?: string;
  children: ReactNode;
}

interface TitleProps {
  level?: Level;
  className?: string;
  children: ReactNode;
}

type TextType = "secondary" | "success" | "warning" | "danger";

interface TextProps {
  className?: string;
  children: ReactNode;
  type?: TextType;
  disabled?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  strong?: boolean;
}

type EllipsisExpandable = boolean | "collapsible";

interface EllipsisConfig {
  rows?: number;
  expandable?: EllipsisExpandable;
  expanded?: boolean; // controlled
  onExpand?: (
    e: MouseEvent<HTMLSpanElement>,
    info: { expanded: boolean }
  ) => void;
  symbol?: string | ((expanded: boolean) => ReactNode);
}

interface ParagraphProps {
  className?: string;
  children: ReactNode;
  ellipsis?: boolean | EllipsisConfig;
}

type TypographyCompound = FC<TypographyProps> & {
  Title: FC<TitleProps>;
  Text: FC<TextProps>;
  Paragraph: FC<ParagraphProps>;
};

const levelClassName: Record<Level, string> = {
  1: "text-3xl font-bold",
  2: "text-2xl font-semibold",
  3: "text-xl font-medium",
  4: "text-lg font-normal",
  5: "text-sm font-light",
};

const textTypeClassName: Record<TextType, string> = {
  secondary: "text-gray-500",
  success: "text-green-600",
  warning: "text-orange-600",
  danger: "text-red-600",
};

// ------------ Base Typography ------------

const TypographyBase: FC<TypographyProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

// ------------ Title ------------

const Title: FC<TitleProps> = ({ level = 1, className, children }) => {
  const classes = `${levelClassName[level]} ${className ?? ""}`;

  switch (level) {
    case 1:
      return <h1 className={classes}>{children}</h1>;
    case 2:
      return <h2 className={classes}>{children}</h2>;
    case 3:
      return <h3 className={classes}>{children}</h3>;
    case 4:
      return <h4 className={classes}>{children}</h4>;
    case 5:
    default:
      return <h5 className={classes}>{children}</h5>;
  }
};

// ------------ Text ------------

const Text: FC<TextProps> = ({
  className,
  children,
  type,
  disabled,
  mark,
  underline,
  delete: del,
  code,
  strong,
}) => {
  let content: ReactNode = children;

  if (strong) {
    content = <strong>{content}</strong>;
  }
  if (code) {
    content = (
      <code className="font-mono px-1 py-0.5 rounded bg-gray-100">
        {content}
      </code>
    );
  }
  if (mark) {
    content = <mark className="bg-yellow-200 px-0.5">{content}</mark>;
  }
  if (underline) {
    content = <span className="underline">{content}</span>;
  }
  if (del) {
    content = <del>{content}</del>;
  }

  const typeClass = type ? textTypeClassName[type] : "text-gray-900";
  const disabledClass = disabled ? "text-gray-400 cursor-not-allowed" : "";

  const classes = ["text-base", typeClass, disabledClass, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{content}</span>;
};

// ------------ Paragraph with ellipsis ------------

// ------------ Paragraph with ellipsis ------------

const Paragraph: FC<ParagraphProps> = ({ className, children, ellipsis }) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const isEllipsisObj =
    typeof ellipsis === "object" &&
    ellipsis !== null &&
    !Array.isArray(ellipsis);

  const isSimpleEllipsis = ellipsis === true;

  const rows = isEllipsisObj && ellipsis.rows ? ellipsis.rows : undefined;
  const expandable = isEllipsisObj && !!ellipsis.expandable;
  const symbol = isEllipsisObj ? ellipsis.symbol : undefined;

  // controlled vs uncontrolled expanded
  const expanded =
    isEllipsisObj && typeof ellipsis.expanded === "boolean"
      ? ellipsis.expanded
      : false;

  const shouldEllipsis = !!ellipsis;

  // measure truncation ONLY in collapsed state, and never reset when expanded
  useEffect(() => {
    if (!textRef.current) return;
    if (!isEllipsisObj || !rows) return;
    if (expanded) return; // keep previous truncation result when expanded

    const el = textRef.current;
    const truncated = el.scrollHeight > el.clientHeight + 1;
    setIsTruncated(truncated);
  }, [isEllipsisObj, rows, expanded, children, className]);

  const handleToggle = (e: MouseEvent<HTMLSpanElement>) => {
    if (!isEllipsisObj) return;

    const next = !expanded;
    ellipsis.onExpand?.(e, { expanded: next });
  };

  // Apply clamp styles ONLY to the inner span, not to <p>
  const textStyle =
    shouldEllipsis && rows && !expanded
      ? {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical" as const,
          WebkitLineClamp: rows,
          overflow: "hidden",
        }
      : undefined;

  const baseClasses = [
    "text-base leading-relaxed",
    isSimpleEllipsis ? "truncate" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const symbolNode =
    typeof symbol === "function"
      ? symbol(expanded)
      : symbol ?? (expanded ? "Less" : "More");

  return (
    <p className={baseClasses}>
      <span
        ref={textRef}
        style={textStyle}
        className={shouldEllipsis && rows && !expanded ? "inline-block" : ""}
      >
        {children}
      </span>

      {shouldEllipsis && expandable && isTruncated && (
        <>
          {" "}
          <span
            className="text-blue-500 cursor-pointer select-none"
            onClick={handleToggle}
          >
            {symbolNode}
          </span>
        </>
      )}
    </p>
  );
};

// ------------ Compound export ------------

export const Typography: TypographyCompound = Object.assign(TypographyBase, {
  Title,
  Text,
  Paragraph,
});

export default Typography;
