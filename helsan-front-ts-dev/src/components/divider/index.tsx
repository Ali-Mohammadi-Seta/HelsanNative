import { FC } from "react";

type placement = "start" | "end" | "center";
interface IDividerProps {
  text?: string;
  className?: string;
  placement?: placement;
  textClassName?: string;
  dividerLineClassName?: string;
}

const Divider: FC<IDividerProps> = ({
  text,
  className,
  placement = "start",
  textClassName,
  dividerLineClassName,
}) => {
  const containerClassName: Record<placement, string> = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
  };
  if (text) {
    return (
      <div
        className={`flex items-center gap-2 ${containerClassName[placement]}`}
      >
        <p
          className={`${
            placement === "start" ? "w-10" : "flex-1"
          } ${dividerLineClassName} h-[2px] rounded-lg bg-[#dddd]`}
        />
        <p className={`${textClassName}`}>{text}</p>
        <p
          className={`${
            placement === "end" ? "w-10" : "flex-1"
          } ${dividerLineClassName} h-[2px] rounded-lg bg-[#dddd]`}
        />
      </div>
    );
  }
  return (
    <>
      <div
        className={`w-full h-[2px] bg-[#dddd] my-5 rounded-lg ${className}`}
      />
    </>
  );
};

export default Divider;
