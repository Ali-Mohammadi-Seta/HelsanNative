import { lazy, Suspense, ComponentType, ReactNode } from 'react';

type LoadableOptions = {
  fallback?: ReactNode;
};

function Loadable<P extends object = object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  { fallback = null }: LoadableOptions = {}
) {
  const LazyComponent = lazy(importFunc);
  return (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export default Loadable;
