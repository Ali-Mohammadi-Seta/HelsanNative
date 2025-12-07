# Testing Implementation Checklist

Use this checklist to track your testing implementation progress.

## ✅ Setup Phase

- [ ] **Install testing dependencies**

  ```bash
  yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom jsdom @vitest/ui @vitest/coverage-v8 msw @types/node
  ```

  - [ ] If permission errors: Close editors, try again, or delete node_modules and reinstall

- [ ] **Verify test configuration**

  - [ ] Check `vite.config.ts` has test config ✓ (Already done)
  - [ ] Check `src/test/setup.ts` exists ✓ (Already done)
  - [ ] Check `src/test/test-utils.tsx` exists ✓ (Already done)

- [ ] **Run existing tests to verify setup**
  ```bash
  yarn test:run
  ```
  - [ ] All existing tests pass
  - [ ] No configuration errors

## 📝 Writing Tests Phase

### Priority 1: Critical Utilities (100% coverage goal)

- [x] `toEnglishDigits` - ✅ Already has tests
- [ ] `NationalIdValidator` - ✅ Test file created (needs dependencies)
- [ ] `groupBy` - ✅ Test file created (needs dependencies)
- [ ] `convertMiladiToShamsi` - Need to create tests
- [ ] `toPersianDigits` - Need to create tests
- [ ] `NationalIdRules` - Need to create tests

### Priority 2: API Services (80%+ coverage goal)

- [x] `apiServices` - ✅ Already has tests
- [ ] `authServices` - Need to create tests
- [ ] `profileServices` - Need to create tests
- [ ] `emrServices` - Need to create tests
- [ ] `publicServices` - Need to create tests

### Priority 3: Custom Hooks (70%+ coverage goal)

- [x] `useAuth` - ✅ Already has tests

### Priority 5: Page Components (Integration tests)

- [ ] Auth pages (login, register, etc.)
- [ ] Panel pages
- [ ] Public pages
- [ ] EMR pages

## 🎯 Coverage Goals

Track your overall coverage:

- [ ] Critical utilities: 100% ✓
- [ ] Services: 80%+
- [ ] Hooks: 70%+
- [ ] Components: 60%+
- [ ] Overall: 70%+

**Check coverage:**

```bash
yarn test:coverage
```

## 📚 Learning & Best Practices

- [ ] Read `TESTING_GUIDE.md` for comprehensive documentation
- [ ] Read `TESTING_QUICK_START.md` for quick reference
- [ ] Read `TESTING_IMPLEMENTATION_STEPS.md` for step-by-step guide
- [ ] Review existing test examples:
  - [ ] `src/utils/__tests__/toEnglishDigits.test.ts`
  - [ ] `src/components/button/__tests__/index.test.tsx`
  - [ ] `src/hooks/__tests__/useAuth.test.ts`
  - [ ] `src/services/__tests__/apiServices.test.ts`

## 🔧 Integration

- [ ] Add test script to CI/CD pipeline
- [ ] Set up coverage reporting in CI/CD
- [ ] Configure coverage thresholds

## 📊 Regular Tasks

- [ ] Run tests before committing: `yarn test:run`
- [ ] Run tests in watch mode during development: `yarn test`
- [ ] Check coverage monthly: `yarn test:coverage`
- [ ] Review and update test mocks as API changes

---

**Next Steps:**

1. Start with Step 1: Install dependencies (see `TESTING_IMPLEMENTATION_STEPS.md`)
2. Run existing tests to verify setup
3. Write tests for critical utilities first
4. Gradually expand coverage
