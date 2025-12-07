# Testing Guide for Helsan Frontend

This guide provides step-by-step instructions for implementing and running tests in the Helsan frontend project.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Test Structure](#test-structure)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Best Practices](#best-practices)

## 🎯 Overview

We use the following testing stack:

- **Vitest**: Fast unit test framework powered by Vite
- **React Testing Library**: Simple and complete testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking for tests
- **jsdom**: DOM implementation for Node.js (simulates browser environment)

## 📦 Prerequisites

Before running tests, ensure you have:

1. Node.js (v18 or higher)
2. Yarn package manager
3. All project dependencies installed

## 🚀 Installation

### Step 1: Install Testing Dependencies

Run the following command to install all testing dependencies:

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom jsdom @vitest/ui @vitest/coverage-v8 msw @types/node
```

**Note**: `@vitest/coverage-v8` is required for code coverage reports.

**Note**: If you encounter permission errors (EPERM) on Windows, try:

- Closing any editors/terminals that might have locked files
- Running the terminal as Administrator
- Restarting your computer if the issue persists

### Step 2: Verify Installation

After installation, verify that the dependencies are added to `package.json`:

```json
"devDependencies": {
  // ... existing dependencies
  "vitest": "^1.x.x",
  "@testing-library/react": "^16.x.x",
  "@testing-library/jest-dom": "^6.x.x",
  // ... etc
}
```

## 📁 Test Structure

The test files are organized as follows:

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   ├── test-utils.tsx        # Testing utilities and custom render
│   └── mocks/
│       ├── handlers.ts       # MSW API handlers
│       └── server.ts         # MSW server setup
├── components/
│   └── button/
│       ├── __tests__/
│       │   └── index.test.tsx
│       └── index.tsx
├── hooks/
│   └── __tests__/
│       └── useAuth.test.ts
├── utils/
│   └── __tests__/
│       └── toEnglishDigits.test.ts
└── services/
    └── __tests__/
        └── apiServices.test.ts
```

## ▶️ Running Tests

### Available Test Commands

1. **Run tests in watch mode** (recommended for development):

   ```bash
   yarn test
   ```

2. **Run tests with UI** (visual test runner):

   ```bash
   yarn test:ui
   ```

3. **Run tests once** (for CI/CD):

   ```bash
   yarn test:run
   ```

4. **Run tests with coverage report**:
   ```bash
   yarn test:coverage
   ```

### Watch Mode Options

When running `yarn test`, you can use:

- `a` - Run all tests
- `f` - Run only failed tests
- `t` - Filter by test name pattern
- `u` - Update snapshots
- `q` - Quit watch mode

## ✍️ Writing Tests

### 1. Testing Utility Functions

Utility functions are the easiest to test. Example:

```typescript
// src/utils/__tests__/toEnglishDigits.test.ts
import { describe, it, expect } from "vitest";
import { toEnglishDigits } from "../toEnglishDigits";

describe("toEnglishDigits", () => {
  it("should convert Persian digits to English", () => {
    expect(toEnglishDigits("۰۱۲۳")).toBe("0123");
  });
});
```

### 2. Testing React Components

Use the custom `render` function from `test-utils.tsx`:

```typescript
// src/components/button/__tests__/index.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import CustomButton from "../index";

describe("CustomButton", () => {
  it("should render button with text", () => {
    render(<CustomButton>Click Me</CustomButton>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Testing Custom Hooks

Use `renderHook` from `@testing-library/react`:

```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { createTestStore } from "@/test/test-utils";
import { Provider } from "react-redux";

const wrapper = ({ children }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe("useAuth", () => {
  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.loading).toBe(true);
  });
});
```

### 4. Testing API Services

MSW automatically mocks API calls. You can override handlers per test:

```typescript
// src/services/__tests__/apiServices.test.ts
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

describe("apiServices", () => {
  it("should make successful GET request", async () => {
    server.use(
      http.get("*/user/userInfo", () => {
        return HttpResponse.json({ id: 1, name: "Test" });
      })
    );

    const result = await apiServices.get("/user/userInfo");
    expect(result.isSuccess).toBe(true);
  });
});
```

## 🎨 Best Practices

### 1. Test Structure

Follow the AAA pattern:

- **Arrange**: Set up test data and conditions
- **Act**: Execute the code under test
- **Assert**: Verify the expected outcome

```typescript
it("should add two numbers", () => {
  // Arrange
  const a = 2;
  const b = 3;

  // Act
  const result = add(a, b);

  // Assert
  expect(result).toBe(5);
});
```

### 2. Test Naming

Use descriptive test names:

- ✅ Good: `"should display error message when API call fails"`
- ❌ Bad: `"test 1"` or `"works"`

### 3. Testing User Interactions

Use `@testing-library/user-event` for realistic user interactions:

```typescript
import userEvent from "@testing-library/user-event";

it("should update input value", async () => {
  const user = userEvent.setup();
  render(<Input />);

  const input = screen.getByRole("textbox");
  await user.type(input, "Hello");

  expect(input).toHaveValue("Hello");
});
```

### 4. Query Priorities

Follow this priority order when querying elements:

1. **Queries accessible to everyone**:

   - `getByRole` (preferred)
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`

2. **Semantic queries**:
   - `getByAltText`
   - `getByTitle`
   - `getByTestId` (last resort)

### 5. Async Testing

Always handle async operations properly:

```typescript
it("should load data", async () => {
  render(<Component />);

  // Wait for async operation
  await waitFor(() => {
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });
});
```

### 6. Mocking

- Mock external dependencies (APIs, libraries)
- Don't mock the code you're testing
- Use MSW for API mocking
- Use `vi.mock()` for module mocking

### 7. Test Isolation

- Each test should be independent
- Don't rely on test execution order
- Clean up after tests (handled automatically by our setup)

### 8. Coverage Goals

Aim for:

- **80%+** overall coverage
- **100%** coverage for critical utilities and functions
- **70%+** coverage for components

## 🔧 Configuration Files

### vite.config.ts

The Vitest configuration is integrated into `vite.config.ts`:

```typescript
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  css: true,
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"],
  },
}
```

### src/test/setup.ts

Contains global test setup:

- Jest-DOM matchers
- Browser API mocks (matchMedia, IntersectionObserver, etc.)
- MSW server lifecycle management

## 🐛 Troubleshooting

### Tests not running

1. Ensure dependencies are installed: `yarn install`
2. Check that `vite.config.ts` includes test configuration
3. Verify `src/test/setup.ts` exists and is properly configured

### MSW not mocking requests

1. Ensure `server.listen()` is called in `beforeAll`
2. Check that handlers are defined in `src/test/mocks/handlers.ts`
3. Verify API URLs match between your code and handlers

### Component tests failing with Redux

1. Ensure you're using the custom `render` from `test-utils.tsx`
2. Provide a test store when needed:
   ```typescript
   const store = createTestStore({ auth: { isLoggedIn: true } });
   render(<Component />, { store });
   ```

### TypeScript errors in tests

1. Ensure `@types/node` is installed
2. Check that `vitest/globals` types are available
3. Verify import paths use the `@/` alias correctly

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

## ✅ Next Steps

1. Install dependencies (see Installation section)
2. Run example tests: `yarn test`
3. Write tests for your components following the examples
4. Gradually increase test coverage
5. Integrate tests into your CI/CD pipeline

---

**Happy Testing! 🧪**
