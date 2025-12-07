# Step-by-Step Testing Implementation Guide

This guide will walk you through implementing software testing for the Helsan frontend project.

## 📋 Overview

Your project already has:
- ✅ Test configuration in `vite.config.ts`
- ✅ Test setup files (`src/test/setup.ts`, `src/test/test-utils.tsx`)
- ✅ MSW mock server setup
- ✅ Some example test files
- ❌ Missing: Testing dependencies (need to be installed)

## 🚀 Step 1: Install Testing Dependencies

### Option A: Using Yarn (Recommended)

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom jsdom @vitest/ui @vitest/coverage-v8 msw @types/node
```

### Option B: If you encounter permission errors (Windows)

**Solution 1**: Close all editors and terminals, then try again:
1. Close VS Code/Cursor
2. Close any terminals
3. Run terminal as Administrator
4. Try the install command again

**Solution 2**: Delete node_modules and reinstall:
```bash
# Remove node_modules and lock file
rmdir /s /q node_modules
del yarn.lock

# Reinstall everything
yarn install

# Then install testing dependencies
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom jsdom @vitest/ui @vitest/coverage-v8 msw @types/node
```

### Verify Installation

After installation, check `package.json` should have these in `devDependencies`:
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@testing-library/dom`
- `jsdom`
- `@vitest/ui`
- `@vitest/coverage-v8`
- `msw`
- `@types/node`

## ✅ Step 2: Verify Test Configuration

Your `vite.config.ts` already has the correct test configuration. Verify it includes:

```typescript
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.ts",
  css: true,
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"],
    exclude: [
      "node_modules/",
      "src/test/",
      "**/*.d.ts",
      "**/*.config.*",
      "**/mockData/**",
    ],
  },
}
```

✅ This is already configured correctly!

## 🧪 Step 3: Run Your First Test

After dependencies are installed, verify everything works:

```bash
# Run all tests
yarn test:run

# Or run in watch mode (recommended for development)
yarn test
```

You should see tests passing for:
- `src/utils/__tests__/toEnglishDigits.test.ts`
- `src/components/button/__tests__/index.test.tsx`
- `src/hooks/__tests__/useAuth.test.ts`
- `src/services/__tests__/apiServices.test.ts`

## 📝 Step 4: Understanding Test Structure

### Test File Organization

Tests should be placed in `__tests__` directories next to the source files:

```
src/
├── components/
│   └── button/
│       ├── __tests__/
│       │   └── index.test.tsx     ← Component test
│       └── index.tsx
├── hooks/
│   ├── __tests__/
│   │   └── useAuth.test.ts       ← Hook test
│   └── useAuth.ts
├── utils/
│   ├── __tests__/
│   │   └── toEnglishDigits.test.ts  ← Utility test
│   └── toEnglishDigits.ts
└── services/
    ├── __tests__/
    │   └── apiServices.test.ts   ← Service test
    └── apiServices.ts
```

## 📚 Step 5: Writing Tests - Examples

### 5.1 Testing Utility Functions

**Example**: Testing `toEnglishDigits` function

```typescript
// src/utils/__tests__/toEnglishDigits.test.ts
import { describe, it, expect } from "vitest";
import { toEnglishDigits } from "../toEnglishDigits";

describe("toEnglishDigits", () => {
  it("should convert Persian digits to English", () => {
    expect(toEnglishDigits("۰۱۲۳")).toBe("0123");
  });

  it("should handle empty strings", () => {
    expect(toEnglishDigits("")).toBe("");
  });
});
```

**To write tests for other utilities:**
1. Create a `__tests__` folder next to the utility file
2. Create a `.test.ts` file with the same name
3. Import the function and test various scenarios

### 5.2 Testing React Components

**Example**: Testing a button component

```typescript
// src/components/button/__tests__/index.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import CustomButton from "../index";

describe("CustomButton", () => {
  it("should render button with text", () => {
    render(<CustomButton>Click Me</CustomButton>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
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

**Key points:**
- Use `render` from `@/test/test-utils` (includes Redux, Router, i18n providers)
- Use `screen` to query elements
- Use `userEvent` for user interactions
- Prefer `getByRole` over `getByText` or `getByTestId`

### 5.3 Testing Custom Hooks

**Example**: Testing a custom hook

```typescript
// src/hooks/__tests__/useMyHook.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useMyHook } from "../useMyHook";
import { createTestStore } from "@/test/test-utils";
import { Provider } from "react-redux";

const wrapper = ({ children }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe("useMyHook", () => {
  it("should return initial value", () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });
    expect(result.current.value).toBe("expected");
  });

  it("should update value", async () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });
    
    // Trigger update
    result.current.updateValue("new");
    
    await waitFor(() => {
      expect(result.current.value).toBe("new");
    });
  });
});
```

### 5.4 Testing API Services

**Example**: Testing API service functions

```typescript
// src/services/__tests__/myService.test.ts
import { describe, it, expect } from "vitest";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { myApiCall } from "../myService";

describe("myApiCall", () => {
  it("should fetch data successfully", async () => {
    // Override default handler for this test
    server.use(
      http.get("*/api/data", () => {
        return HttpResponse.json({ id: 1, name: "Test" });
      })
    );

    const result = await myApiCall();
    expect(result.data.name).toBe("Test");
  });

  it("should handle errors", async () => {
    server.use(
      http.get("*/api/data", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      })
    );

    const result = await myApiCall();
    expect(result.isSuccess).toBe(false);
  });
});
```

**Key points:**
- MSW automatically mocks API calls
- Use `server.use()` to override handlers for specific tests
- Default handlers are in `src/test/mocks/handlers.ts`

## 🎯 Step 6: Testing Strategy

### Priority Order for Writing Tests

1. **Critical utilities** (e.g., data converters, validators)
   - These are used everywhere and bugs here affect everything

2. **API services**
   - Ensure API integration works correctly

3. **Custom hooks**
   - Business logic often lives in hooks

4. **Reusable components**
   - Components used in multiple places

5. **Page components**
   - Integration tests for full page flows

### Test Coverage Goals

- **Critical utilities**: 100% coverage
- **Services**: 80%+ coverage
- **Hooks**: 70%+ coverage
- **Components**: 60%+ coverage
- **Overall**: Aim for 70%+ coverage

## 🔧 Step 7: Running Tests

### Available Commands

```bash
# Watch mode (re-runs tests on file changes)
yarn test

# Run tests once (for CI/CD)
yarn test:run

# Run with UI (visual test runner)
yarn test:ui

# Generate coverage report
yarn test:coverage
```

### Watch Mode Keyboard Shortcuts

When running `yarn test`:
- `a` - Run all tests
- `f` - Run only failed tests
- `t` - Filter by test name
- `u` - Update snapshots
- `q` - Quit watch mode

## 📊 Step 8: Viewing Coverage Reports

After running `yarn test:coverage`, coverage reports are generated in:
- **HTML**: `coverage/index.html` (open in browser)
- **JSON**: `coverage/coverage-final.json`
- **Text**: Displayed in terminal

## 🎨 Step 9: Best Practices

### 1. Test Naming
✅ Good: `"should display error message when API call fails"`
❌ Bad: `"test 1"` or `"works"`

### 2. Test Structure (AAA Pattern)
```typescript
it("should do something", () => {
  // Arrange - Set up test data
  const input = "test";
  
  // Act - Execute the code
  const result = myFunction(input);
  
  // Assert - Verify the outcome
  expect(result).toBe("expected");
});
```

### 3. Query Priorities
1. `getByRole` (best - most accessible)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

### 4. Async Testing
Always use `waitFor` or `findBy*` queries for async operations:
```typescript
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

### 5. Mock External Dependencies
- Use MSW for API mocking
- Use `vi.mock()` for module mocking
- Don't mock the code you're testing

## 🚦 Step 10: Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: yarn test:run

- name: Generate coverage
  run: yarn test:coverage
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Ensure imports use the `@/` alias correctly or relative paths

### Issue: "Tests timing out"
**Solution**: Use `waitFor` or increase timeout:
```typescript
it("should load", async () => {
  // ... test code
}, { timeout: 10000 });
```

### Issue: "MSW not mocking requests"
**Solution**: 
1. Check `server.listen()` is called in `beforeAll`
2. Verify API URLs match between code and handlers
3. Ensure handlers are defined in `src/test/mocks/handlers.ts`

### Issue: "Redux state not working in tests"
**Solution**: Use `createTestStore()` and pass it to `render`:
```typescript
const store = createTestStore({ auth: { isLoggedIn: true } });
render(<Component />, { store });
```

## 📖 Next Steps

1. ✅ Install dependencies (Step 1)
2. ✅ Run existing tests to verify setup (Step 3)
3. 📝 Write tests for critical utilities first
4. 📝 Gradually add tests for other components
5. 📊 Monitor coverage with `yarn test:coverage`
6. 🔄 Integrate tests into your development workflow

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

---

**Ready to start? Begin with Step 1 - Install dependencies!** 🚀
