/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  };
}
