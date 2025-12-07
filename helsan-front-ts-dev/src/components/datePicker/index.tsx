import { FC, useEffect, useState } from "react";
import DateInput, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface DatePickerProps {
  value?: DateObject | null;
  onChange?: (dateIsoString: string | null) => void;
  label: string;
  minDate?: DateObject;
  maxDate?: DateObject;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  required = false,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [date, setDate] = useState<DateObject | null>(null);

  const isActive = focused || !!value;

  useEffect(() => {
    setDate(value ?? null);
  }, [value]);

  return (
    <div className={`relative !w-full ${className}`}>
      <DateInput
        calendar={persian}
        locale={persian_fa}
        minDate={minDate}
        maxDate={maxDate}
        className="custom-datepicker"
        value={date}
        onChange={(e: DateObject | null) => {
          if (onChange) {
            if (e instanceof DateObject) {
              onChange(new Date(e.toUnix() * 1000).toISOString());
            } else {
              onChange(null);
            }
          }
        }}
        format="YYYY/MM/DD"
        editable={true}
        onOpen={() => setFocused(true)}
        onClose={() => setFocused(false)}
        containerClassName="w-full"
        inputClass={`w-full h-12 px-3 pt-2 pb-1 text-base border border-gray-300 rounded-md outline-none hover:border-colorPrimary focus:border-colorPrimary transition-all duration-200 ${inputClassName}`}
        {...props}
      />

      <label
        className={`
          absolute right-3 px-1 text-gray-500 text-sm bg-white transition-all pointer-events-none z-10
          ${isActive ? "text-xs -top-2.5" : "top-3"}
        `}
      >
        {label}
        {required && <span className="text-red-500 me-1">*</span>}
      </label>
    </div>
  );
};

export default DatePicker;
