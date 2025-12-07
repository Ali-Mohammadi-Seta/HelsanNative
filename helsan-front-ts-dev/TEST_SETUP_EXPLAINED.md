# Understanding `src/test/setup.ts`

This file is automatically run **before every test file** in your project. It sets up the testing environment and mocks browser APIs that aren't available in Node.js (where tests run).

## 📋 Overview

The `setup.ts` file is configured in `vite.config.ts`:
```typescript
test: {
  setupFiles: "./src/test/setup.ts",
  // ...
}
```

This means Vitest will run this file's code before executing any test, ensuring all tests have the same environment setup.

---

## 🔍 Section-by-Section Explanation

### 1. **Testing Library Setup** (Lines 1-2)

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
```

- **`@testing-library/jest-dom`**: Adds custom Jest DOM matchers like `.toBeInTheDocument()`, `.toBeDisabled()`, etc.
  - Example: `expect(button).toBeInTheDocument()` instead of `expect(button).not.toBeNull()`
  
- **`cleanup`**: Function to clean up React components after each test to prevent memory leaks

---

### 2. **MSW (Mock Service Worker) Setup** (Lines 3-20)

```typescript
import { server } from "./mocks/server";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

**Purpose**: Sets up API mocking so tests don't make real HTTP requests.

- **`beforeAll()`**: Runs once before all tests
  - Starts the MSW server to intercept HTTP requests
  - `onUnhandledRequest: "error"` means any API call not mocked will cause a test to fail (helps catch unmocked requests)

- **`afterEach()`**: Runs after every test
  - `cleanup()`: Removes rendered components from the DOM
  - `server.resetHandlers()`: Resets API mocks to defaults, ensuring test isolation

- **`afterAll()`**: Runs once after all tests
  - Stops the MSW server to clean up resources

**Why it matters**: 
- Tests run fast (no network delays)
- Tests are reliable (no dependency on external APIs)
- Tests are isolated (each test starts with clean mocks)

---

### 3. **window.matchMedia Mock** (Lines 22-35)

```typescript
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    // ... event listeners
  })),
});
```

**Purpose**: Mocks the browser's `matchMedia` API used for responsive design/media queries.

**Why needed**: 
- Libraries like Ant Design, Material-UI, and Tailwind use `window.matchMedia` to detect screen sizes
- Node.js doesn't have this API, so tests would crash without the mock

**What it returns**:
- A MediaQueryList-like object with common methods
- `matches: false` by default (you can override in individual tests if needed)

**Example usage in your code**:
```typescript
// Your component might use this:
if (window.matchMedia("(max-width: 768px)").matches) {
  // Mobile view
}
```

---

### 4. **IntersectionObserver Mock** (Lines 37-42)

```typescript
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

**Purpose**: Mocks the IntersectionObserver API used for:
- Lazy loading images
- Infinite scroll
- "Scroll into view" animations
- Detecting when elements enter/leave viewport

**Why needed**: 
- Used by many modern libraries (React Intersection Observer, Framer Motion, etc.)
- Node.js doesn't have this API

**What it provides**: Mock methods that do nothing but prevent errors

---

### 5. **ResizeObserver Mock** (Lines 44-50)

```typescript
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(_callback: ResizeObserverCallback) {}
} as any;
```

**Purpose**: Mocks ResizeObserver API used for:
- Detecting element size changes
- Responsive components
- Layout calculations

**Why needed**:
- Used by libraries like Ant Design's Table, Charts, etc.
- Especially important if you use `rc-resize-observer`

**Note**: Uses a class instead of a function mock because some libraries check `instanceof ResizeObserver`

---

### 6. **Geolocation Mock** (Lines 52-60)

```typescript
Object.defineProperty(navigator, "geolocation", {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});
```

**Purpose**: Mocks the browser's Geolocation API for location-based features.

**Why needed**:
- Your project has `useGeolocation` hook
- Tests would fail without this mock when components use geolocation

**In your tests**, you can override it:
```typescript
navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
  success({ coords: { latitude: 35.6892, longitude: 51.3890 } });
});
```

---

### 7. **localStorage Mock** (Lines 62-69)

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

**Purpose**: Mocks browser's localStorage API.

**Why needed**:
- Many apps store data in localStorage (tokens, settings, etc.)
- Node.js doesn't have localStorage
- Mock functions prevent errors and allow test control

**In your tests**, you can mock return values:
```typescript
localStorage.getItem.mockReturnValue('{"token": "abc123"}');
```

---

### 8. **sessionStorage Mock** (Lines 71-78)

```typescript
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock as any;
```

**Purpose**: Same as localStorage but for sessionStorage (data cleared when tab closes).

**Why needed**: Same reasons as localStorage.

---

## 🎯 Summary

This setup file ensures:

1. ✅ **Consistent Environment**: All tests run in the same environment
2. ✅ **No Real API Calls**: MSW intercepts and mocks all HTTP requests
3. ✅ **Browser API Mocks**: All browser-specific APIs are mocked
4. ✅ **Test Isolation**: Each test starts with clean mocks
5. ✅ **No Crashes**: Tests don't fail due to missing browser APIs

---

## 🔧 Common Customizations

### Mock return values in specific tests:

```typescript
// Override matchMedia for a specific test
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: query === "(max-width: 768px)",
  // ...
}));

// Override localStorage
localStorage.getItem.mockReturnValue('{"user": "test"}');

// Override geolocation
navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
  success({ coords: { latitude: 35.6892, longitude: 51.3890 } });
});
```

### Add new mocks:

If you use other browser APIs, add them here:

```typescript
// Example: Mock Speech Recognition API
global.SpeechRecognition = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  // ...
}));
```

---

## 📚 Related Files

- **`src/test/mocks/server.ts`**: MSW server configuration
- **`src/test/mocks/handlers.ts`**: Default API response handlers
- **`src/test/test-utils.tsx`**: Custom React render function with providers
- **`vite.config.ts`**: References this file in test configuration

---

This setup file is the foundation that makes all your tests work reliably! 🚀

