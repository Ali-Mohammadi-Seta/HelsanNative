import { FC, ReactNode } from "react";

interface IEmptyProps {
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
}

const Empty: FC<IEmptyProps> = ({
  icon,
  description = "موردی یافت نشد.",
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-gray-500 ${className}`}
    >
      <span className="text-4xl">
        {icon ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10"
            aria-hidden="true"
          >
            {/* Circle */}
            <circle
              cx="11"
              cy="11"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            {/* Handle */}
            <line
              x1="15"
              y1="15"
              x2="20"
              y2="20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Small cross inside circle to indicate "no result" */}
            <line
              x1="9"
              y1="9"
              x2="13"
              y2="13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="13"
              y1="9"
              x2="9"
              y2="13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
};

export default Empty;
