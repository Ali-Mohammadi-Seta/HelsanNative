// ToastManager.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
  FC,
  useCallback,
} from 'react';
import Toast from './ToastView';
import { setToastHandler, ToastPayload, ToastPosition } from './toastApi';
import { CornerPortal } from './toastPortal';

// --- Type Definitions ---

interface ToastState extends ToastPayload {
  id: number;
  position: ToastPosition;
  duration: number;
  closable: boolean;
}

interface ToastDefaults {
  position: ToastPosition;
  duration: number;
  closable: boolean;
}

interface ToastContextType {
  addToast: (toast: ToastPayload) => number;
  removeToast: (id: number) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  defaults?: Partial<ToastDefaults>;
  maxToastsPerCorner?: number;
}

// --- Constants and Context ---

const DEFAULTS: ToastDefaults = {
  position: 'topRight',
  duration: 3000,
  closable: false,
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

let idCounter = 0;
const nextId = (): number => {
  idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER;
  return Date.now() + idCounter;
};

// --- Component ---

export const ToastProvider: FC<ToastProviderProps> = ({
  children,
  defaults,
  maxToastsPerCorner,
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const mountedRef = useRef(true);

  const mergedDefaults = useMemo<ToastDefaults>(
    () => ({ ...DEFAULTS, ...(defaults || {}) }),
    [defaults]
  );

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = useCallback(
    (toast: ToastPayload): number => {
      const id = nextId();
      const withDefaults: ToastState = {
        id,
        type: toast.type,
        message: toast.message,
        position: toast.position ?? mergedDefaults.position,
        duration: toast.duration ?? mergedDefaults.duration,
        closable: toast.closable ?? mergedDefaults.closable,
        icon: toast.icon,
        className: toast.className,
      };

      setToasts((prev) => {
        const next = [...prev, withDefaults];

        if (!maxToastsPerCorner) return next;

        const counts: Record<ToastPosition, ToastState[]> = {
          topLeft: [],
          topRight: [],
          bottomLeft: [],
          bottomRight: [],
        };
        for (const t of next) counts[t.position].push(t);

        const trimmed: ToastState[] = [];
        (Object.keys(counts) as ToastPosition[]).forEach((corner) => {
          const list = counts[corner];
          trimmed.push(
            ...(list.length <= maxToastsPerCorner
              ? list
              : list.slice(list.length - maxToastsPerCorner))
          );
        });
        trimmed.sort((a, b) => a.id - b.id);
        return trimmed;
      });

      return id;
    },
    [mergedDefaults, maxToastsPerCorner]
  );

  useEffect(() => {
    setToastHandler((opts: ToastPayload) => {
      if (!mountedRef.current) return;
      addToast(opts);
    });
  }, [addToast]);

  const grouped = useMemo(() => {
    const map: Record<ToastPosition, ToastState[]> = {
      topLeft: [], topRight: [], bottomLeft: [], bottomRight: []
    };
    for (const t of toasts) {
      map[t.position].push(t);
    }
    return map;
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {(Object.keys(grouped) as ToastPosition[]).map((corner) => (
        <CornerPortal key={corner} corner={corner}>
          {grouped[corner].map((t) => (
            <div key={t.id} className='pointer-events-auto'>
              <Toast
                type={t.type}
                duration={t.duration}
                closable={t.closable}
                icon={t.icon}
                className={t.className}
                onClose={() => removeToast(t.id)}
              >
                {t.message}
              </Toast>
            </div>
          ))}
        </CornerPortal>
      ))}
    </ToastContext.Provider>
  );
};