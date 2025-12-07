import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useCallback,
} from "react";

type Values = Record<string, any>;

export type Rule =
  | { required: true; message?: string }
  | { pattern: RegExp; message?: string }
  | { min?: number; max?: number; message?: string }
  | {
      validator: (value: any, values: Values) => void | Promise<void>;
      message?: string;
    };

type ItemMeta = {
  errors: string[];
  touched: boolean;
  validating: boolean;
};

type State = {
  values: Values;
  metas: Record<string, ItemMeta>;
};

type Action =
  | { type: "SET_VALUE"; name: string; value: any }
  | { type: "SET_VALUES"; values: Values }
  | { type: "SET_META"; name: string; meta: Partial<ItemMeta> }
  | { type: "RESET"; values: Values };

function getPath(obj: any, path: string) {
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}
function setPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const last = keys.pop()!;
  let cur = obj;
  for (const k of keys) {
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[last] = value;
}

const defaultMeta: ItemMeta = { errors: [], touched: false, validating: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VALUE": {
      const next = { ...state.values };
      setPath(next, action.name, action.value);
      return { ...state, values: next };
    }
    case "SET_VALUES":
      return { ...state, values: { ...state.values, ...action.values } };
    case "SET_META": {
      const current = state.metas[action.name] ?? defaultMeta;
      return {
        ...state,
        metas: {
          ...state.metas,
          [action.name]: { ...current, ...action.meta },
        },
      };
    }
    case "RESET":
      return { values: action.values, metas: {} };
    default:
      return state;
  }
}

type FormItemRegistration = {
  name: string;
  rules?: Rule[];
  validateTrigger?: "change" | "blur" | "submit" | "never";
  dependencies?: string[];
  getValue: () => any;
};

export type FormInstance = {
  getFieldValue: (name: string) => any;
  getFieldsValue: () => Values;
  setFieldsValue: (patch: Values) => void;
  setFieldValue: (name: string, value: any) => void;
  resetFields: (nextInitials?: Values) => void;
  validateFields: (names?: string[]) => Promise<Values>;
  submit: () => void;
  subscribe: (listener: () => void) => () => void; // for useWatch outside Provider
  _registerItem: (item: FormItemRegistration) => void; // internal
  _unregisterItem: (name: string) => void; // internal
};

type FormContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  form: FormInstance;
  initialValuesRef: React.RefObject<Values>;
  onFinishRef: React.RefObject<((v: Values) => void) | undefined>;
  onFinishFailedRef: React.RefObject<((e: any) => void) | undefined>;
};

export const FormContext = createContext<FormContextType | null>(null);

type FormProps = {
  initialValues?: Values;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (err: any) => void;
  children: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export function Form(props: FormProps & { form?: FormInstance }) {
  const {
    initialValues = {},
    onFinish,
    onFinishFailed,
    children,
    form: externalForm,
    ...nativeProps
  } = props;

  const [state, dispatch] = useReducer(reducer, {
    values: initialValues,
    metas: {},
  });

  const initialValuesRef = useRef(initialValues);
  const itemsRef = useRef<Map<string, FormItemRegistration>>(new Map());
  const onFinishRef = useRef(onFinish);
  const onFinishFailedRef = useRef(onFinishFailed);
  const listenersRef = useRef<Set<() => void>>(new Set());

  onFinishRef.current = onFinish;
  onFinishFailedRef.current = onFinishFailed;

  const runRules = useCallback(
    async (name: string, value: any) => {
      const reg = itemsRef.current.get(name);
      if (!reg || !reg.rules?.length) return [];

      dispatch({ type: "SET_META", name, meta: { validating: true } });

      const errors: string[] = [];
      for (const r of reg.rules) {
        try {
          if (
            "required" in r &&
            r.required &&
            (value == null || value === "")
          ) {
            throw new Error(r.message || "This field is required");
          }
          if ("pattern" in r && r.pattern && value != null && value !== "") {
            if (!r.pattern.test(String(value))) {
              throw new Error(r.message || "Invalid format");
            }
          }
          if (("min" in r || "max" in r) && typeof value === "string") {
            if (r.min != null && value.length < r.min) {
              throw new Error(r.message || `Minimum length is ${r.min}`);
            }
            if (r.max != null && value.length > r.max) {
              throw new Error(r.message || `Maximum length is ${r.max}`);
            }
          }
          if ("validator" in r && typeof r.validator === "function") {
            await r.validator(value, state.values);
          }
        } catch (err: any) {
          errors.push(err?.message || "Validation failed");
        }
      }

      dispatch({
        type: "SET_META",
        name,
        meta: { errors, validating: false, touched: true },
      });
      return errors;
    },
    [state.values]
  );

  const validateMany = useCallback(
    async (names?: string[]) => {
      const targetNames = names || Array.from(itemsRef.current.keys());
      const errMap: Record<string, string[]> = {};
      for (const n of targetNames) {
        const v = getPath(state.values, n);
        const errs = await runRules(n, v);
        if (errs.length) errMap[n] = errs;
      }
      if (Object.keys(errMap).length) {
        const error = { values: state.values, errorFields: errMap };
        throw error;
      }
      return state.values;
    },
    [runRules, state.values]
  );

  const instance: FormInstance = useMemo(() => {
    return {
      getFieldValue: (name) => getPath(state.values, name),
      getFieldsValue: () => state.values,
      setFieldsValue: (patch) =>
        dispatch({ type: "SET_VALUES", values: patch }),
      setFieldValue: (name, value) =>
        dispatch({ type: "SET_VALUE", name, value }),
      resetFields: (nextInitials) => {
        const base = nextInitials ?? initialValuesRef.current ?? {};
        dispatch({ type: "RESET", values: base });
      },
      validateFields: validateMany,
      submit: async () => {
        try {
          const values = await validateMany();
          onFinishRef.current?.(values);
        } catch (e) {
          onFinishFailedRef.current?.(e);
        }
      },
      subscribe: (listener) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
      _registerItem: (item) => {
        itemsRef.current.set(item.name, item);
      },
      _unregisterItem: (name) => {
        itemsRef.current.delete(name);
      },
    };
  }, [state.values, validateMany]);

  React.useEffect(() => {
    if (externalForm) Object.assign(externalForm, instance);
  }, [externalForm, instance]);

  // notify outside subscribers whenever values change
  React.useEffect(() => {
    listenersRef.current.forEach((fn) => fn());
  }, [state.values]);

  const ctx: FormContextType = {
    state,
    dispatch,
    form: instance,
    initialValuesRef,
    onFinishRef,
    onFinishFailedRef,
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    instance.submit();
  };

  return (
    <FormContext.Provider value={ctx}>
      <form {...nativeProps} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export function useForm(): [FormInstance] {
  const dummy = useRef<FormInstance>({} as any);
  return [dummy.current];
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within <Form>");
  return ctx;
}

// useWatch: works inside Provider; also works outside if you pass `form`.
// Outside usage auto-updates via `form.subscribe`.
export function useWatch<T = any>(
  name?: string | string[],
  form?: FormInstance,
  defaultValue?: T,
  options?: { debounce?: number; equalityFn?: (a: T, b: T) => boolean }
): T {
  const ctx = useContext(FormContext);
  const inContext = !!ctx;
  const [, force] = React.useReducer((x) => x + 1, 0);

  // Subscribe when used outside Provider
  React.useEffect(() => {
    if (!inContext && form?.subscribe) {
      const unsub = form.subscribe(() => force());
      // initial tick for hydration
      force();
      return unsub;
    }
  }, [inContext, form]);

  // Source values (from context or form)
  const values: Values | undefined = inContext
    ? ctx!.state.values
    : form?.getFieldsValue?.();

  // Helper to read a path safely
  const read = React.useCallback(
    (path?: string) =>
      path
        ?.split(".")
        .reduce((acc: any, k) => (acc == null ? acc : acc[k]), values),
    [values]
  );

  // Compute the *raw* (non-debounced) selected value
  const rawSelected = React.useMemo<T>(() => {
    if (!values) {
      if (name == null) return (defaultValue as T) ?? ({} as T);
      if (Array.isArray(name)) return {} as T;
      return defaultValue as T;
    }

    if (name == null) return values as unknown as T;

    if (Array.isArray(name)) {
      const out: Record<string, any> = {};
      for (const n of name) out[n] = read(n);
      return out as unknown as T;
    }

    const v = read(name);
    return v === undefined ? (defaultValue as T) : (v as T);
  }, [values, name, read, defaultValue]) as T;

  // Debounce + equality check
  const debounceMs = options?.debounce ?? 0;
  const isEqual = options?.equalityFn ?? Object.is;

  const [debounced, setDebounced] = React.useState<T>(rawSelected);
  const lastRef = React.useRef<T>(rawSelected);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // If equal, do nothing
    if (isEqual(rawSelected, lastRef.current)) return;

    if (debounceMs <= 0) {
      lastRef.current = rawSelected;
      setDebounced(rawSelected);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lastRef.current = rawSelected;
      setDebounced(rawSelected);
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [rawSelected, debounceMs, isEqual]);

  return debounced;
}

export { getPath, setPath };
