import {
  FC,
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

type BtnType = "primary" | "secondary" | "danger";
type BtnVariant = "solid" | "text" | "link";
type BtnSize = "large" | "default" | "small";
type IconPosition = "left" | "right";

type CommonProps = {
  children?: ReactNode;
  /** color theme */
  type?: BtnType;
  /** presentation style */
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  loading?: boolean;
  /** When provided, renders <a> (link) instead of <button> */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
};

type ButtonLikeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  htmlType?: "button" | "submit" | "reset";
};

type AnchorLikeProps = AnchorHTMLAttributes<HTMLAnchorElement>;

type ICustomButtonProps = CommonProps & ButtonLikeProps & AnchorLikeProps;

const CustomButton: FC<ICustomButtonProps> = ({
  children,
  type = "primary",
  variant = "solid",
  size = "default",
  icon,
  iconPosition = "left",
  htmlType = "button",
  disabled,
  loading = false,
  className = "",
  href,
  target,
  rel,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center select-none rounded-xl font-medium " +
    "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed text-nowrap ";

  // Sizes
  const sizesSolid: Record<BtnSize, string> = {
    large: "h-12 px-4 text-base gap-2",
    default: "h-10 px-4 text-sm gap-2",
    small: "h-8 px-3 text-xs gap-1.5",
  };
  const sizesTexty: Record<BtnSize, string> = {
    large: "h-auto p-0 text-base gap-2",
    default: "h-auto p-0 text-sm gap-2",
    small: "h-auto p-0 text-xs gap-1.5",
  };
  const isTexty = variant === "text" || variant === "link";
  const sizeClass = isTexty ? sizesTexty[size] : sizesSolid[size];

  // Colors by (type, variant)
  const tone = {
    primary: {
      solid:
        "bg-colorPrimary text-white hover:brightness-95 active:brightness-90 focus-visible:ring-colorPrimary",
      text: "bg-transparent text-colorPrimary hover:opacity-85 active:opacity-75 focus-visible:ring-colorPrimary/50",
      link: "bg-transparent text-colorPrimary hover:brightness-110 active:brightness-90 focus-visible:ring-colorPrimary/50 no-underline",
    },
    secondary: {
      solid:
        "bg-colorSecandary text-white hover:brightness-95 active:brightness-90 focus-visible:ring-colorSecandary",
      text: "bg-transparent text-colorSecandary hover:opacity-85 active:opacity-75 focus-visible:ring-colorSecandary/50",
      link: "bg-transparent text-colorSecandary hover:brightness-110 active:brightness-90 focus-visible:ring-colorSecandary/50 no-underline",
    },
    danger: {
      solid:
        "bg-red-600 text-white hover:brightness-95 active:brightness-90 focus-visible:ring-red-600",
      text: "bg-transparent text-red-600 hover:text-red-700 active:text-red-800 focus-visible:ring-red-600/50",
      link: "bg-transparent text-red-600 hover:text-red-700 active:text-red-800 focus-visible:ring-red-600/50 no-underline",
    },
  } as const;

  // Icon position
  const flows: Record<IconPosition, string> = {
    left: "flex-row-reverse",
    right: "flex-row",
  };

  const isDisabled = disabled || loading;

  // When href is present, render an <a>. Otherwise, render <button>
  const Comp: any = href ? "a" : "button";
  const roleProps = href
    ? { href, target, rel, "aria-disabled": isDisabled || undefined }
    : {
        type: htmlType,
        disabled: isDisabled,
        "aria-disabled": isDisabled || undefined,
      };

  // Prevent navigation when "disabled" anchor
  const clickBlocker =
    href && isDisabled
      ? (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }
      : undefined;

  // Extract onClick from rest to handle it properly when disabled
  const { onClick: restOnClick, ...restWithoutOnClick } = rest;

  return (
    <Comp
      className={`${base}${tone[type][variant]} ${sizeClass} ${flows[iconPosition]} ${className} cursor-pointer`}
      aria-busy={loading || undefined}
      onClick={isDisabled && href ? clickBlocker : restOnClick || clickBlocker}
      {...roleProps}
      {...restWithoutOnClick}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 mr-0.5 h-[1.1em] w-[1.1em]"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Icon (hidden when loading) */}
      {icon && !loading && <span className="flex items-center ">{icon}</span>}

      {/* Label */}
      {children && (
        <span className="inline-flex items-center leading-none p-[2px] gap-1">
          {children}
        </span>
      )}
    </Comp>
  );
};

export default CustomButton;
