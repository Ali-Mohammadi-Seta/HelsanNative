// Grid.tsx
import {
  createContext,
  useContext,
  CSSProperties,
  ReactNode,
  FC,
  useEffect,
  useState,
} from "react";

type Gutter = [number, number]; // [horizontal, vertical]

type RowJustify =
  | "start"
  | "end"
  | "center"
  | "space-around"
  | "space-between"
  | "space-evenly";

type RowAlign = "top" | "middle" | "bottom" | "stretch";

interface RowProps {
  children?: ReactNode;
  gutter?: number | Gutter;
  justify?: RowJustify;
  align?: RowAlign;
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

// ---- Responsive breakpoint types ----
type ColBreakpointValue =
  | number
  | {
      span?: number;
      offset?: number;
      flex?: number | string;
    };

interface ColProps {
  children?: ReactNode;

  // base values (used as fallback)
  span?: number; // 1–24
  offset?: number; // 0–24
  flex?: number | string;

  // responsive values (Antd-like)
  xs?: ColBreakpointValue;
  sm?: ColBreakpointValue;
  md?: ColBreakpointValue;
  lg?: ColBreakpointValue;
  xl?: ColBreakpointValue;

  className?: string;
  style?: CSSProperties;
}

// ---- Context to share gutter from Row to Col ----
const RowContext = createContext<Gutter | undefined>(undefined);

const justifyMap: Record<RowJustify, CSSProperties["justifyContent"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  "space-around": "space-around",
  "space-between": "space-between",
  "space-evenly": "space-evenly",
};

const alignMap: Record<RowAlign, CSSProperties["alignItems"]> = {
  top: "flex-start",
  middle: "center",
  bottom: "flex-end",
  stretch: "stretch",
};

// ---- Row ----
export const Row: FC<RowProps> = ({
  children,
  gutter = 0,
  justify = "start",
  align = "top",
  wrap = true,
  className,
  style,
}) => {
  const [horizontal, vertical]: Gutter = Array.isArray(gutter)
    ? gutter
    : [gutter, 0];

  const rowStyle: CSSProperties = {
    display: "flex",
    flexWrap: wrap ? "wrap" : "nowrap",
    marginLeft: horizontal ? -horizontal / 2 : undefined,
    marginRight: horizontal ? -horizontal / 2 : undefined,
    rowGap: vertical || undefined,
    justifyContent: justifyMap[justify],
    alignItems: alignMap[align],
    ...style,
  };

  return (
    <RowContext.Provider value={[horizontal, vertical]}>
      <div className={className} style={rowStyle}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

// ---- Breakpoint hook (Antd-like sizes) ----
// xs: < 576
// sm: ≥ 576
// md: ≥ 768
// lg: ≥ 992
// xl: ≥ 1200
type BreakpointName = "xs" | "sm" | "md" | "lg" | "xl";

const breakpointOrder: BreakpointName[] = ["xs", "sm", "md", "lg", "xl"];

const getBreakpointFromWidth = (width: number): BreakpointName => {
  if (width >= 1200) return "xl";
  if (width >= 992) return "lg";
  if (width >= 768) return "md";
  if (width >= 576) return "sm";
  return "xs";
};

const useCurrentBreakpoint = (): BreakpointName => {
  const [bp, setBp] = useState<BreakpointName>(() => {
    if (typeof window === "undefined") return "xs";
    return getBreakpointFromWidth(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setBp(getBreakpointFromWidth(window.innerWidth));
    };

    // use resize; could also use matchMedia for each breakpoint
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return bp;
};

// helper to normalize breakpoint prop
const normalizeBreakpointValue = (
  value?: ColBreakpointValue
): { span?: number; offset?: number; flex?: number | string } | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "number") {
    return { span: value };
  }
  return value;
};

// ---- Col ----
export const Col: FC<ColProps> = (props) => {
  const { children, className, style } = props;
  const gutter = useContext(RowContext) || [0, 0];
  const [horizontal, vertical] = gutter;

  const currentBp = useCurrentBreakpoint();

  // base values
  let span = props.span;
  let offset = props.offset;
  let flex = props.flex;

  // responsive overrides: we cascade from current breakpoint down
  // e.g. current=lg -> try lg, then md, sm, xs
  const currentIndex = breakpointOrder.indexOf(currentBp);

  for (let i = currentIndex; i >= 0; i--) {
    const bpName = breakpointOrder[i];
    const value = props[bpName];
    const config = normalizeBreakpointValue(value);

    if (config) {
      if (config.span !== undefined) span = config.span;
      if (config.offset !== undefined) offset = config.offset;
      if (config.flex !== undefined) flex = config.flex;
      break; // stop at first matching config
    }
  }

  let flexStyle: CSSProperties = {};

  if (flex !== undefined) {
    // Flex mode (like antd's Col flex)
    flexStyle = { flex };
  } else if (span !== undefined) {
    const widthPercent = (span / 24) * 100;
    flexStyle = {
      flex: `0 0 ${widthPercent}%`,
      maxWidth: `${widthPercent}%`,
    };
  }

  const colStyle: CSSProperties = {
    paddingLeft: horizontal ? horizontal / 2 : undefined,
    paddingRight: horizontal ? horizontal / 2 : undefined,
    marginBottom: vertical || undefined,
    marginLeft:
      offset && offset > 0 ? `${(offset / 24) * 100}%` : undefined,
    boxSizing: "border-box",
    ...flexStyle,
    ...style,
  };

  return (
    <div className={className} style={colStyle}>
      {children}
    </div>
  );
};
