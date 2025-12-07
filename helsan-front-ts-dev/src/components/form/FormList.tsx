import React from "react";
import { useFormContext } from "./";

type FormListProps = {
  name: string; // e.g., "users" or "addresses.home"
  children: (
    fields: { key: string; name: number }[],
    ops: { add: (initial?: any) => void; remove: (index: number) => void }
  ) => React.ReactNode;
};

export function FormList({ name, children }: FormListProps) {
  const { state, dispatch } = useFormContext();
  const arr: any[] =
    name.split(".").reduce((a: any, k) => (a ? a[k] : undefined), state.values) ?? [];

  const fields = arr.map((_, idx) => ({ key: `${name}-${idx}`, name: idx }));

  const add = (initial: any = {}) => {
    const next = [...arr, initial];
    dispatch({ type: "SET_VALUE", name, value: next });
  };

  const remove = (index: number) => {
    const next = arr.filter((_, i) => i !== index);
    dispatch({ type: "SET_VALUE", name, value: next });
  };

  return <>{children(fields, { add, remove })}</>;
}
