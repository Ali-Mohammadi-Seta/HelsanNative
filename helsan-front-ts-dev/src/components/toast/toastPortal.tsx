// toastPortal.tsx
import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState, FC } from 'react';
import { ToastPosition } from './toastApi';

const cornerClass: Record<ToastPosition, string> = {
  topLeft: 'fixed top-4 left-4',
  topRight: 'fixed top-4 right-4',
  bottomLeft: 'fixed bottom-4 left-4',
  bottomRight: 'fixed bottom-4 right-4',
};

export function useCornerContainer(corner: ToastPosition): HTMLElement | null {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const id = `toast-corner-${corner}`;
    let container = document.getElementById(id);

    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className =
        `${cornerClass[corner]} z-[100000] ` +
        'pointer-events-none flex flex-col gap-2';
      document.body.appendChild(container);
    }
    setEl(container);
  }, [corner]);

  return el;
}

interface CornerPortalProps {
  corner: ToastPosition;
  children: ReactNode;
}

export const CornerPortal: FC<CornerPortalProps> = ({ corner, children }) => {
  const el = useCornerContainer(corner);
  if (!el) return null;
  return createPortal(children, el);
};