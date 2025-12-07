import { CSSProperties, FC } from "react";
import styles from "./skeleton.module.css";

type SizeValue = number | string;

interface SkeletonBaseProps {
  className?: string;
  rows?: number;
  active?: boolean;
  width?: SizeValue;
  height?: SizeValue;
}

interface InputSkeletonProps {
  className?: string;
  active?: boolean;
  width?: SizeValue;
  height?: SizeValue;
}

type AvatarShape = "circle" | "square";

interface AvatarSkeletonProps {
  className?: string;
  active?: boolean;
  size?: number;
  shape?: AvatarShape;
}

interface ImageSkeletonProps {
  className?: string;
  active?: boolean;
  width?: SizeValue;
  height?: SizeValue;
  style?: CSSProperties;
}

interface ParagraphSkeletonProps {
  className?: string;
  rows?: number;
  /** can be a single value or an array per-row */
  width?: SizeValue | SizeValue[];
  active?: boolean;
  /** single value or array per-row */
  rowHeights?: SizeValue | SizeValue[];
  rowSpacing?: SizeValue;
}

interface TitleSkeletonProps {
  className?: string;
  active?: boolean;
  width?: SizeValue;
  height?: SizeValue;
}

type ButtonSize = "small" | "default" | "large";
type ButtonShape = "default" | "round";

interface ButtonSkeletonProps {
  className?: string;
  active?: boolean;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
}

// ------------------------------------
// Base skeleton
// ------------------------------------

const SkeletonBase: FC<SkeletonBaseProps> = ({
  className,
  rows = 1,
  active = true,
  width,
  height,
}) => {
  // If rows > 1, render multiple skeleton lines (paragraph-like)
  if (rows > 1) {
    return (
      <div className={className}>
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className={`bg-[#EDEDED] rounded-md mb-3 shadow-xl overflow-hidden ${
              active ? styles.shimmer : ""
            }`}
            style={{
              width:
                width ??
                (index === rows - 1 ? "60%" : "100%"), // Last row typically shorter
              height: height ?? "20px",
            }}
          />
        ))}
      </div>
    );
  }

  // Single skeleton block
  return (
    <div
      className={`${
        className ?? ""
      } w-full h-[120px] bg-[#EDEDED] my-10 rounded-md shadow-xl overflow-hidden ${
        active ? styles.shimmer : ""
      }`}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
      }}
    />
  );
};

// ------------------------------------
// Input
// ------------------------------------

const Input: FC<InputSkeletonProps> = ({
  className,
  active = true,
  width,
  height,
}) => (
  <div
    className={`${
      className ?? ""
    } w-full h-10 bg-[#EDEDED] rounded-md my-10 shadow-xl overflow-hidden ${
      active ? styles.shimmer : ""
    }`}
    style={{
      width: width ?? undefined,
      height: height ?? "40px",
    }}
  />
);

// ------------------------------------
// Avatar
// ------------------------------------

const Avatar: FC<AvatarSkeletonProps> = ({
  className,
  active = true,
  size = 80,
  shape = "circle",
}) => (
  <div
    className={`${
      className ?? ""
    } bg-[#EDEDED] my-10 shadow-xl overflow-hidden ${
      shape === "circle" ? "rounded-full" : "rounded-md"
    } ${active ? styles.shimmer : ""}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
    }}
  />
);

// ------------------------------------
// Image
// ------------------------------------

const Image: FC<ImageSkeletonProps> = ({
  className,
  active = true,
  width = 200,
  height = 200,
  style = {},
}) => (
  <div
    className={`${
      className ?? ""
    } bg-[#EDEDED] rounded-md shadow-xl overflow-hidden inline-flex items-center justify-center relative ${
      active ? styles.shimmer : ""
    }`}
    style={{
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      ...style,
    }}
  >
    {/* Simple image icon placeholder */}
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="opacity-20"
    >
      <path
        d="M44 6H4C2.89543 6 2 6.89543 2 8V40C2 41.1046 2.89543 42 4 42H44C45.1046 42 46 41.1046 46 40V8C46 6.89543 45.1046 6 44 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="14" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2 42L16 28L24 36L34 26L46 38V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ------------------------------------
// Paragraph
// ------------------------------------

const Paragraph: FC<ParagraphSkeletonProps> = ({
  rows = 3,
  width = "100%",
  className,
  active = true,
  rowHeights = "20px",
  rowSpacing = "12px",
}) => (
  <div className={className}>
    {Array.from({ length: rows }, (_, index) => {
      const isWidthArray = Array.isArray(width);
      const rowWidth: SizeValue = isWidthArray
        ? width[index] ?? width[width.length - 1]
        : index === rows - 1
        ? "60%"
        : width;

      const isHeightArray = Array.isArray(rowHeights);
      const rowHeight: SizeValue = isHeightArray
        ? rowHeights[index] ?? rowHeights[0]
        : rowHeights;

      return (
        <div
          key={index}
          className={`bg-[#EDEDED] rounded-md shadow-xl overflow-hidden ${
            active ? styles.shimmer : ""
          }`}
          style={{
            width: rowWidth,
            height: rowHeight,
            marginBottom: index < rows - 1 ? rowSpacing : 0,
          }}
        />
      );
    })}
  </div>
);

// ------------------------------------
// Title
// ------------------------------------

const Title: FC<TitleSkeletonProps> = ({
  className,
  active = true,
  width = "40%",
  height = "24px",
}) => (
  <div
    className={`${
      className ?? ""
    } bg-[#EDEDED] rounded-md mb-4 shadow-xl overflow-hidden ${
      active ? styles.shimmer : ""
    }`}
    style={{
      width,
      height,
    }}
  />
);

// ------------------------------------
// Button
// ------------------------------------

const Button: FC<ButtonSkeletonProps> = ({
  className,
  active = true,
  size = "default",
  shape = "default",
  block = false,
}) => {
  const sizeMap: Record<ButtonSize, { height: string; width: string }> = {
    small: { height: "24px", width: "60px" },
    default: { height: "32px", width: "80px" },
    large: { height: "40px", width: "100px" },
  };

  const dimensions = sizeMap[size] || sizeMap.default;

  return (
    <div
      className={`${
        className ?? ""
      } bg-[#EDEDED] shadow-xl overflow-hidden inline-block ${
        shape === "round" ? "rounded-full" : "rounded-md"
      } ${active ? styles.shimmer : ""}`}
      style={{
        width: block ? "100%" : dimensions.width,
        height: dimensions.height,
      }}
    />
  );
};

// ------------------------------------
// Combined Skeleton type
// ------------------------------------

interface SkeletonComponent extends FC<SkeletonBaseProps> {
  Input: FC<InputSkeletonProps>;
  Avatar: FC<AvatarSkeletonProps>;
  Image: FC<ImageSkeletonProps>;
  Paragraph: FC<ParagraphSkeletonProps>;
  Title: FC<TitleSkeletonProps>;
  Button: FC<ButtonSkeletonProps>;
}

export const Skeleton: SkeletonComponent = Object.assign(SkeletonBase, {
  Input,
  Avatar,
  Image,
  Paragraph,
  Title,
  Button,
}) as SkeletonComponent;

export default Skeleton;
