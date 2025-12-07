# Testing Quick Start Guide

## 🚀 Quick Commands

```bash
# Install dependencies
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom jsdom @vitest/ui @vitest/coverage-v8 msw @types/node

# Run tests in watch mode
yarn test

# Run tests with UI
yarn test:ui

# Run tests once
yarn test:run

# Generate coverage report
yarn test:coverage
```

## 📝 Test File Naming Convention

Place test files next to the source files:

```
src/
├── components/
│   └── button/
│       ├── __tests__/
│       │   └── index.test.tsx  ← Test file
│       └── index.tsx            ← Source file
├── utils/
│   ├── __tests__/
│   │   └── toEnglishDigits.test.ts
│   └── toEnglishDigits.ts
```

## 🎯 Example Test Templates

### Component Test
```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import Component from "./Component";

describe("Component", () => {
  it("should render", () => {
    render(<Component />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Utility Test
```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "../myFunction";

describe("myFunction", () => {
  it("should work correctly", () => {
    expect(myFunction("input")).toBe("output");
  });
});
```

### Hook Test
```typescript
import { renderHook } from "@testing-library/react";
import { useMyHook } from "../useMyHook";
import { createTestStore } from "@/test/test-utils";
import { Provider } from "react-redux";

const wrapper = ({ children }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe("useMyHook", () => {
  it("should work", () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });
    expect(result.current.value).toBe("expected");
  });
});
```

## 📚 Documentation

See `TESTING_GUIDE.md` for complete documentation.

