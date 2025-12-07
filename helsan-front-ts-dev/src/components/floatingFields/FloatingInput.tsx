import { toEnglishDigits } from '@/utils/toEnglishDigits';
import React, { useEffect, useMemo, useState } from 'react';

/* --------------------------------- utils --------------------------------- */
const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(' ');

const formatPrice = (value: string) => {
  if (!value) return '';
  const numberValue = Number(value.replace(/,/g, ''));
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat().format(numberValue);
};

/* ------------------------------- icons (svg) ------------------------------ */
const EyeOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeClosed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.88 5.09C10.56 5 11.27 5 12 5c6.5 0 10 7 10 7a18.1 18.1 0 0 1-4.15 5.27M6.28 6.28C4.14 7.79 2.7 10 2 12c0 0 3.5 7 10 7 1.78 0 3.39-.4 4.8-1.06" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.17 9.17A3 3 0 0 0 12 15a3 3 0 0 0 2.83-3.83" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/* ---------------------------- OTP segmented UI --------------------------- */
function OtpInputGroup({
  length = 6,
  value = '',
  disabled,
  dir = 'rtl',
  onChange,
  onFocus,
  onBlur,
  className,
  boxClassName,
  autoFocus,
}: {
  length?: number;
  value?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  className?: string;
  boxClassName?: string;
  autoFocus?: boolean;
  dir?: "rtl" | "ltr";
}) {
  const refs = useMemo(
    () => Array.from({ length }, () => React.createRef<HTMLInputElement>()),
    [length]
  );

  const digits = (value || '').replace(/\D/g, '');
  const chars = Array.from({ length }, (_, i) => digits[i] || '');

  const focusIndex = (idx: number) => {
    const i = Math.max(0, Math.min(length - 1, idx));
    const el = refs[i]?.current;
    if (el) el.focus();
  };

  const setWithPaste = (start: number, raw: string) => {
    const paste = toEnglishDigits(raw || '').replace(/\D/g, '');
    if (!paste) return;
    const next = chars.slice();
    for (let i = 0; i < paste.length && start + i < length; i++) {
      next[start + i] = paste[i];
    }
    onChange(next.join(''));
    setTimeout(() => focusIndex(Math.min(start + paste.length, length - 1)), 0);
  };

  return (
    <div
      style={{ direction: dir }}
      className={cn(
        'flex w-full items-center justify-center',
        'gap-[35px] 2xs:gap-[15px]',
        className
      )}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          value={chars[i]}
          disabled={disabled}
          maxLength={1}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            const v = toEnglishDigits(e.target.value || '').replace(/\D/g, '');
            if (!v) {
              const next = chars.slice();
              next[i] = '';
              onChange(next.join(''));
              return;
            }
            if (v.length === 1) {
              const next = chars.slice();
              next[i] = v;
              onChange(next.join(''));
              setTimeout(() => focusIndex(i + 1), 0);
            } else {
              setWithPaste(i, v);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              if (!chars[i] && i > 0) {
                e.preventDefault();
                const prev = i - 1;
                const next = chars.slice();
                next[prev] = '';
                onChange(next.join(''));
                setTimeout(() => focusIndex(prev), 0);
              }
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              focusIndex(i - 1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              focusIndex(i + 1);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            setWithPaste(i, e.clipboardData.getData('text') || '');
          }}
          className={cn(
            // Code-inputs matching styles
            'w-[25px] h-[25px] text-center text-[26px]',
            'bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none',
            'text-colorPrimary',
            'focus:outline-none focus:border-b focus:border-colorPrimary',
            'disabled:bg-gray-100',
            boxClassName
          )}
          style={{
            caretColor: '#16a34a'
          }}
          autoFocus={autoFocus && i === 0}
        />
      ))}
    </div>
  );
}

/* ------------------------------ component API ---------------------------- */
type ClassNamesSlots = {
  root?: string;
  fieldWrapper?: string;
  input?: string;
  textarea?: string;
  otpGroup?: string;
  otpBox?: string;
  label?: string;
  labelActive?: string;
  labelInactive?: string;
  passwordToggle?: string;
  passwordIcon?: string;
};

interface FloatingInputProps {
  label?: React.ReactNode;
  textarea?: boolean;
  dir?: 'ltr' | 'rtl';
  onChange?: any;
  value?: string | number | null;
  labelBg?: string;
  labelText?: string;
  type?: string;
  priceFormatter?: boolean;
  disabled?: boolean;
  otp?: boolean;
  otpSegmented?: boolean;
  otpLength?: number;
  floatingLabel?: boolean;
  passwordToggle?: boolean;
  otpAutoFocus?: boolean;
  passwordToggleIcons?: {
    show?: React.ReactNode;
    hide?: React.ReactNode;
  };
  className?: string;
  classNames?: ClassNamesSlots;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onFocus?: (e: React.FocusEvent<any>) => void;
  [key: string]: any;
}

/* --------------------------- main FloatingInput --------------------------- */
const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  textarea,
  dir = 'rtl',
  onChange,
  value: propsValue,
  labelBg = 'bg-white',
  labelText = 'text-gray-500',
  type,
  className: rootClassName,
  classNames,
  onBlur,
  onFocus,
  priceFormatter = false,
  disabled = false,
  otp = false,
  otpSegmented = true,
  otpLength = 6,
  floatingLabel = true,
  passwordToggle = false,
  passwordToggleIcons,
  otpAutoFocus = false,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const isNumber = type === 'number';
  const isPassword = type === 'password';
  const isOtp = !!otp;

  // sync in value
  useEffect(() => {
    const next =
      propsValue === undefined || propsValue === null ? '' : String(propsValue);
    const englishNext = toEnglishDigits(next);
    setDisplayValue(priceFormatter && !isOtp ? formatPrice(englishNext) : englishNext);
  }, [propsValue, priceFormatter, isOtp]);

  // active state (for floating label)
  const isActive = focused || (displayValue && displayValue.trim() !== '');

  // input mode
  const computedInputMode =
    isOtp || isNumber || priceFormatter ? 'numeric' : rest.inputMode;

  // handlers
  const handleFieldFocus = (e: React.FocusEvent<any>) => {
    if (disabled) return;
    setFocused(true);
    onFocus?.(e);
  };

  const handleFieldBlur = (e: React.FocusEvent<any>) => {
    if (disabled) return;
    const related = e.relatedTarget as HTMLElement | null;
    const current = e.currentTarget as HTMLElement;
    if (!related || !current.contains(related)) {
      setFocused(false);
      onBlur?.(e);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (disabled) return;

    const convertedValue = toEnglishDigits(e.target.value);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: convertedValue,
      },
    };

    if (priceFormatter && !isOtp) {
      const unformatted = convertedValue.replace(/,/g, '');
      if (!/^\d*$/.test(unformatted)) return;
      setDisplayValue(formatPrice(unformatted));
      syntheticEvent.target.value = unformatted;
      onChange?.(syntheticEvent);
      return;
    }

    if (isNumber && !/^\d*$/.test(convertedValue)) return;
    setDisplayValue(convertedValue);
    onChange?.(syntheticEvent);
  };

  const handleOtpChange = (val: string) => {
    if (disabled) return;
    const englishVal = toEnglishDigits(val || '');
    const digitsOnly = englishVal.replace(/\D/g, '');
    const limited = otpLength ? digitsOnly.slice(0, otpLength) : digitsOnly;
    setDisplayValue(limited);
    onChange?.(limited);
  };

  // Password toggle
  const effectiveType =
    isPassword ? (showPassword ? 'text' : 'password') : 'text';

  // defaults and slots
  const defaultPasswordIcons = {
    show: <EyeOpen className={cn('h-5 w-5 text-[#AEAFB0]', classNames?.passwordIcon)} />,
    hide: <EyeClosed className={cn('h-5 w-5 text-[#AEAFB0]', classNames?.passwordIcon)} />,
  };

  const pwIcons = {
    show: passwordToggleIcons?.show ?? defaultPasswordIcons.show,
    hide: passwordToggleIcons?.hide ?? defaultPasswordIcons.hide,
  };

  // Base classes with design system integration
  const baseWrapper = cn(
    'w-full relative rounded-md',
    otp ? '' : 'border border-gray-300 focus-within:ring-1 focus-within:ring-colorPrimary focus-within:border-colorPrimary',
    disabled ? 'bg-gray-100' : 'bg-white',
    textarea ? 'items-start py-3' : 'items-center h-12',
    'px-3 flex gap-2',
    classNames?.fieldWrapper
  );

  const baseInput = cn(
    'flex-1 bg-transparent outline-none border-0',
    'h-full min-h-0 py-0 text-start bg-black',
    disabled && 'cursor-not-allowed',
    classNames?.input
  );

  const baseTextarea = cn(
    'flex-1 bg-transparent outline-none border-0 resize-y',
    'min-h-20 pt-6 pb-1 text-start bg-black',
    disabled && 'cursor-not-allowed',
    classNames?.textarea
  );

  const labelBase = cn(
    'text-sm transition-all px-1 pointer-events-none z-10',
    classNames?.label
  );

  const labelActiveCls = cn('text-xs -top-2.5', classNames?.labelActive);
  const labelInactiveCls = cn(
    textarea ? 'top-5' : 'top-3',
    classNames?.labelInactive
  );

  // OTP single input (not segmented)
  const renderSingleOtp = () => (
    <input
      {...rest}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(e) => handleOtpChange(e.target.value)}
      disabled={disabled}
      maxLength={otpLength}
      className={baseInput}
      placeholder={floatingLabel ? undefined : rest.placeholder}
    />
  );

  return (
    <div
      className={cn(
        'relative',
        isOtp && otpSegmented && 'mb-[27px]',
        disabled && 'cursor-not-allowed',
        classNames?.root,
        rootClassName
      )}
      onFocusCapture={handleFieldFocus}
      onBlurCapture={handleFieldBlur}
    >
      {!floatingLabel && label && (
        <div className={cn('mb-1 text-sm', labelText, classNames?.label)}>{label}</div>
      )}

      <div className={baseWrapper} tabIndex={-1}>
        {!isOtp ? (
          textarea ? (
            <textarea
              {...(rest as any)}
              value={displayValue}
              onChange={handleInputChange}
              inputMode={computedInputMode}
              disabled={disabled}
              className={baseTextarea}
              placeholder={floatingLabel ? undefined : rest.placeholder}
            />
          ) : (
            <input
              {...rest}
              type={isPassword ? effectiveType : 'text'}
              inputMode={computedInputMode}
              value={displayValue}
              onChange={handleInputChange}
              disabled={disabled}
              className={baseInput}
              placeholder={floatingLabel ? undefined : rest.placeholder}
            />
          )
        ) : otpSegmented ? (
          <OtpInputGroup
            length={otpLength}
            value={displayValue}
            disabled={disabled}
            onChange={handleOtpChange}
            autoFocus={otpAutoFocus}
            className={cn('w-full', classNames?.otpGroup)}
            boxClassName={classNames?.otpBox}
            dir={dir}
          />
        ) : (
          renderSingleOtp()
        )}

        {isPassword && passwordToggle && !isOtp && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((s) => !s)}
            disabled={disabled}
            className={cn(
              'text-[#AEAFB0] hover:text-colorSecondary transition-colors text-lg',
              'shrink-0',
              classNames?.passwordToggle
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? pwIcons.hide : pwIcons.show}
          </button>
        )}
      </div>

      {floatingLabel && label && (
        <label
          className={cn(
            'absolute right-3',
            labelBase,
            disabled ? 'text-gray-400' : labelText,
            labelBg,
            isActive ? labelActiveCls : labelInactiveCls
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default FloatingInput;