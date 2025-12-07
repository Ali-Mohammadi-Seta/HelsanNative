import { FC, useEffect, useRef, useState, MouseEvent } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";

interface AvatarProps {
  src?: string; // image url
  alt?: string;
  name?: string; // used for initials fallback
  size?: AvatarSize;
  status?: AvatarStatus; // optional small status dot
  className?: string;
  rounded?: "full" | "lg" | "md" | "none";
  editable?: boolean; // make avatar clickable to upload
  onChange?: (file: File | null) => void; // notify parent when file changes
  onRemove?: () => void; // notify parent when user removes avatar via delete icon
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const roundedClasses: Record<NonNullable<AvatarProps["rounded"]>, string> = {
  full: "rounded-full",
  lg: "rounded-2xl",
  md: "rounded-lg",
  none: "rounded-none",
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-400",
};

const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  status,
  className = "",
  rounded = "full",
  editable = false,
  onChange,
  onRemove,
}) => {
  const [hasError, setHasError] = useState(false);
  const [localSrc, setLocalSrc] = useState<string | undefined>(src);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // keep local src in sync with prop src
  useEffect(() => {
    setLocalSrc(src);
  }, [src]);

  const showImage = !!localSrc && !hasError;

  // Click on avatar = open file picker (no longer deletes)
  const handleClick = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation(); // prevent triggering handleClick
    setLocalSrc(undefined);
    setHasError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
    onRemove?.();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange?.(null);
      return;
    }

    setHasError(false);
    const url = URL.createObjectURL(file);
    setLocalSrc(url);
    onChange?.(file);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={[
          "relative inline-flex items-center justify-center bg-gray-300 text-gray-700",
          "font-semibold select-none",
          sizeClasses[size],
          roundedClasses[rounded],
          editable ? "cursor-pointer group" : "",
          className,
        ].join(" ")}
      >
        {showImage ? (
          <img
            src={localSrc}
            alt={alt || name || "avatar"}
            className={`w-full h-full object-cover ${roundedClasses[rounded]}`}
            onError={() => setHasError(true)}
          />
        ) : (
          <span>
            <LuUserRound size={25} className="text-white" />
          </span>
        )}

        {/* Status dot */}
        {status && (
          <span
            className={[
              "absolute top-0 -left-0 w-3 h-3 rounded-full border-2 border-white !z-[5000]",
              statusColors[status],
            ].join(" ")}
          />
        )}

        {/* Editable overlay */}
        {editable && (
          <div
            className={[
              "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100",
              "transition-opacity flex items-center justify-center text-white",
              roundedClasses[rounded],
            ].join(" ")}
          >
            {showImage ? (
              // bigger, clearer delete button
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer shadow-lg focus:outline-none"
              >
                <MdDeleteOutline />
              </button>
            ) : (
              // plus icon
              <span className="text-2xl leading-none font-bold">+</span>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </>
  );
};

export default Avatar;
