import React, {
  useState,
  ReactNode,
  ReactElement,
  CSSProperties,
  isValidElement,
  cloneElement,
  Children,
} from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import { useTranslation } from "react-i18next";
import { toPersianDigits } from "@/utils/antdPagination";

const { Option } = Select;
Option.displayName = "AntdSelectOption";

type OptionType = {
  label: string | number;
  value: string | number;
  options?: OptionType[];
};

interface FloatingSelectProps extends SelectProps<any> {
  label: string;
  value?: any;
  persianDigits?: boolean;
  options?: OptionType[];
  labelBg?: string;
  labelText?: string;
  style?: CSSProperties;
  notFoundContent?: ReactNode;
  children?: ReactNode;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  onChange,
  children,
  notFoundContent,
  persianDigits = false,
  options,
  labelBg = "bg-white",
  labelText = "text-gray-500",
  style = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();

  const isActive =
    focused ||
    (typeof value === "string" && value.trim() !== "") ||
    typeof value === "number" ||
    Array.isArray(value) ||
    typeof value === "boolean";

  const convertToPersianIfApplicable = (text: string | number | ReactNode) => {
    if (
      persianDigits &&
      (typeof text === "string" || typeof text === "number")
    ) {
      return toPersianDigits(String(text));
    }
    return text;
  };

  let processedOptions = options;
  let processedChildren = children;

  if (persianDigits) {
    if (options && Array.isArray(options)) {
      processedOptions = options.map((opt) => {
        const newOpt: OptionType = { ...opt };
        newOpt.label = convertToPersianIfApplicable(newOpt.label) as string;

        if (Array.isArray(newOpt.options)) {
          newOpt.options = newOpt.options.map((subOpt) => ({
            ...subOpt,
            label: convertToPersianIfApplicable(subOpt.label) as string,
          }));
        }

        return newOpt;
      });
    } else if (!options && children) {
      processedChildren = Children.map(children, (child) => {
        if (
          isValidElement(child) &&
          (child.type as any)?.displayName === "AntdSelectOption"
        ) {
          const optionProps = (child as ReactElement<any>).props;
          let textToConvert = optionProps.children;

          if (
            (textToConvert === undefined || textToConvert === null) &&
            (typeof optionProps.value === "string" ||
              typeof optionProps.value === "number")
          ) {
            textToConvert = String(optionProps.value);
          }

          if (
            typeof textToConvert === "string" ||
            typeof textToConvert === "number"
          ) {
            return cloneElement(child as ReactElement<any>, {
              ...optionProps,
              children: convertToPersianIfApplicable(textToConvert),
            });
          }
        }
        return child;
      });
    }
  }

  const finalNotFoundContent = notFoundContent
    ? convertToPersianIfApplicable(notFoundContent)
    : convertToPersianIfApplicable(t("notFound"));

  return (
    <div className="relative" style={style}>
      <Select
        {...props}
        value={value}
        onChange={(val, opt) => onChange?.(val, opt)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        notFoundContent={finalNotFoundContent}
        options={processedOptions}
        className="
          w-full
          [&>.ant-select-selector]:!h-12
          [&>.ant-select-selector]:!flex
          [&>.ant-select-selector]:!items-center
          [&>.ant-select-selector]:!py-0
        "
      >
        {!processedOptions ? processedChildren : null}
      </Select>

      <label
        className={`absolute right-3 text-sm transition-all px-1 pointer-events-none z-10
          ${labelBg} ${labelText}
          ${isActive ? "text-xs -top-2.5" : "top-[14px]"}
        `}
      >
        {convertToPersianIfApplicable(label)}
      </label>
    </div>
  );
};

export default FloatingSelect;
