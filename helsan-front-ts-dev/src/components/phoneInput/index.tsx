import { useState, FC } from "react";
import { AiOutlineMobile } from "react-icons/ai";
import { Input } from "antd";
import type { InputProps } from "antd";

interface PhoneInputProps extends Omit<InputProps, "onChange"> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
const PhoneInput: FC<PhoneInputProps> = ({
  onChange,
  size,
  defaultValue,
  ...props
}) => {
  const [value, setValue] = useState<string>(
    defaultValue ? String(defaultValue) : ""
  );

  const onChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setValue(event.target.value);
      onChange?.(event);
    }
  };

  return (
    <Input
      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
      size={size || "large"}
      maxLength={11}
      minLength={11}
      value={value}
      inputMode="tel"
      prefix={<AiOutlineMobile />}
      onChange={onChangeEvent}
      {...props}
    />
  );
};

export default PhoneInput;
