// toastApi.ts
import { ReactNode } from 'react';

// --- Shared Types ---

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
  closable?: boolean;
  icon?: ReactNode;
  className?: string;
}

export interface ToastPayload extends ToastOptions {
  type: ToastType;
  message: ReactNode;
}

export type ToastHandler = (payload: ToastPayload) => void;


// --- API Implementation ---

let handler: ToastHandler | null = null;

export const setToastHandler = (h: ToastHandler): void => {
  handler = h;
};

const push = (
  type: ToastType,
  message: ReactNode,
  opts?: ToastOptions
): void => {
  if (!handler) return;
  handler({ type, message, ...opts });
};

export const toast = {
  success: (msg: ReactNode, opts?: ToastOptions) => push('success', msg, opts),
  error: (msg: ReactNode, opts?: ToastOptions) => push('error', msg, opts),
  warning: (msg: ReactNode, opts?: ToastOptions) => push('warning', msg, opts),
  info: (msg: ReactNode, opts?: ToastOptions) => push('info', msg, opts),
};