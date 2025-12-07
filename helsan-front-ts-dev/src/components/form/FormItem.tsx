import React, { useEffect, useMemo } from "react";
import { useFormContext, Rule } from "./";

type ControlledProps = {
  value?: any;
  onChange?: (v: any) => void;
  onBlur?: () => void;
  checked?: boolean;
};

type FieldControl = {
  value: any;
  onChange: (v: any) => void;
  onBlur: () => void;
};

type FormItemProps = {
  name?: string;
  label?: React.ReactNode;
  rules?: Rule[];
  validateTrigger?: "change" | "blur" | "submit" | "never";
  dependencies?: string[];
  help?: React.ReactNode;
  extra?: React.ReactNode;
  requiredMark?: boolean;
  valuePropName?: "value" | "checked";
  getValueFromEvent?: (e: any) => any;
  className?: string;
  children:
    | React.ReactElement<ControlledProps>
    | ((control: FieldControl) => React.ReactNode);
};

export function FormItem(props: FormItemProps) {
  const {
    name,
    label,
    rules,
    validateTrigger = "change",
    dependencies,
    help,
    extra,
    requiredMark,
    children,
    valuePropName = "value",
    className,
    getValueFromEvent,
  } = props;

  const { state, dispatch, form } = useFormContext();

  const value = name
    ? name
        .split(".")
        .reduce((acc: any, k) => (acc ? acc[k] : undefined), state.values)
    : undefined;

  const meta = name
    ? state.metas[name] ?? { errors: [], touched: false, validating: false }
    : { errors: [], touched: false, validating: false };

  useEffect(() => {
    if (!name) return;
    form._registerItem({
      name,
      rules,
      validateTrigger,
      dependencies,
      getValue: () => value,
    });
    return () => form._unregisterItem(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    JSON.stringify(rules),
    validateTrigger,
    JSON.stringify(dependencies),
    value,
  ]);

  useEffect(() => {
    if (!name || !rules?.length) return;
    if (validateTrigger === "change") {
      // optionally: form.validateFields([name])
    }
  }, [name, rules, validateTrigger, value, form]);

  const control: FieldControl = useMemo(
    () => ({
      value,
      onChange: (eOrVal: any) => {
        if (!name) return;
        const next = getValueFromEvent
          ? getValueFromEvent(eOrVal)
          : eOrVal?.target != null
          ? valuePropName === "checked"
            ? eOrVal.target.checked
            : eOrVal.target.value
          : eOrVal;
        dispatch({ type: "SET_VALUE", name, value: next });
      },
      onBlur: () => {
        // optionally: form.validateFields([name])
      },
    }),
    [dispatch, name, value, getValueFromEvent, valuePropName]
  );

  const required =
    requiredMark ||
    (rules?.some((r) => "required" in r && r.required) ?? false);

  const renderedChild =
    typeof children === "function"
      ? (children as (c: FieldControl) => React.ReactNode)(control)
      : React.isValidElement<ControlledProps>(children)
      ? React.cloneElement<ControlledProps>(children, {
          [valuePropName]: control.value,
          onChange: control.onChange,
          onBlur: control.onBlur,
        } as ControlledProps)
      : children;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium">
          {required ? <span className="text-red-500">*</span> : null} {label}
        </label>
      )}
      {renderedChild}
      {!!meta.errors.length && (
        <div className="text-xs text-red-600 mt-1">{meta.errors[0]}</div>
      )}
      {help && <div className="text-xs text-gray-500 mt-1">{help}</div>}
      {extra && <div className="text-xs text-gray-500 mt-1">{extra}</div>}
    </div>
  );
}
